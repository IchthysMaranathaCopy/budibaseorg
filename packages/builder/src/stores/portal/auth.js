import { derived, writable, get } from "svelte/store"
import { API } from "api"
import { admin } from "stores/portal"
import getUserInitials from "helpers/userInitials.js"

export function createAuthStore() {
  const auth = writable({
    user: null,
    accountPortalAccess: false,
    tenantId: "default",
    tenantSet: false,
    loaded: false,
    postLogout: false,
  })
  const store = derived(auth, $store => {
    let initials = null
    let isAdmin = false
    let isBuilder = false
    if ($store.user) {
      const user = $store.user
      initials = getUserInitials(user)
      isAdmin = !!user.admin?.global
      isBuilder = !!user.builder?.global
    }
    return {
      user: $store.user,
      accountPortalAccess: $store.accountPortalAccess,
      tenantId: $store.tenantId,
      tenantSet: $store.tenantSet,
      loaded: $store.loaded,
      postLogout: $store.postLogout,
      initials,
      isAdmin,
      isBuilder,
      isSSO: !!$store.user?.provider,
    }
  })

  function setUser(user) {
    auth.update(store => {
      store.loaded = true
      store.user = user
      store.accountPortalAccess = user?.accountPortalAccess
      if (user) {
        store.tenantId = user.tenantId || "default"
        store.tenantSet = true
      }
      return store
    })
  }

  async function setOrganisation(tenantId) {
    const prevId = get(store).tenantId
    auth.update(store => {
      store.tenantId = tenantId
      store.tenantSet = !!tenantId
      return store
    })
    if (prevId !== tenantId) {
      // re-init admin after setting org
      await admin.init()
    }
  }

  async function setInitInfo(info) {
    await API.setInitInfo(info)
    auth.update(store => {
      store.initInfo = info
      return store
    })
    return info
  }

  function setPostLogout() {
    auth.update(store => {
      store.postLogout = true
      return store
    })
  }

  async function getInitInfo() {
    const info = await API.getInitInfo()
    auth.update(store => {
      store.initInfo = info
      return store
    })
    return info
  }

  const actions = {
    checkQueryString: async () => {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.has("tenantId")) {
        const tenantId = urlParams.get("tenantId")
        await setOrganisation(tenantId)
      }
    },
    setOrg: async tenantId => {
      await setOrganisation(tenantId)
    },
    getSelf: async () => {
      // We need to catch this locally as we never want this to fail, even
      // though normally we never want to swallow API errors at the store level.
      // We're either logged in or we aren't.
      // We also need to always update the loaded flag.
      try {
        const user = await API.fetchBuilderSelf()
        setUser(user)
      } catch (error) {
        setUser(null)
      }
    },
    login: async creds => {
      const tenantId = get(store).tenantId
      await API.logIn({
        username: creds.username,
        password: creds.password,
        tenantId,
      })
      await actions.getSelf()
    },
    logout: async () => {
      await API.logOut()
      setPostLogout()
      setUser(null)
      await setInitInfo({})
    },
    updateSelf: async fields => {
      await API.updateSelf({ ...fields })
      // Refetch to enrich after update.
      try {
        const user = await API.fetchBuilderSelf()
        setUser(user)
      } catch (error) {
        setUser(null)
      }
    },
    forgotPassword: async email => {
      const tenantId = get(store).tenantId
      await API.requestForgotPassword({
        tenantId,
        email,
      })
    },
    resetPassword: async (password, resetCode) => {
      const tenantId = get(store).tenantId
      await API.resetPassword({
        tenantId,
        password,
        resetCode,
      })
    },
    generateAPIKey: async () => {
      return API.generateAPIKey()
    },
    fetchAPIKey: async () => {
      const info = await API.fetchDeveloperInfo()
      return info?.apiKey
    },
  }

  return {
    subscribe: store.subscribe,
    setOrganisation,
    getInitInfo,
    setInitInfo,
    ...actions,
  }
}

export const auth = createAuthStore()
