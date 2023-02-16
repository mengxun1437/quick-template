export type State = {
  loading: boolean
}

export const state = (): State => ({
  loading: false,
})

export const mutations = {
  setLoading(state: State, value: boolean) {
    /**
     * @summary - set global loading state
     */
    state.loading = value
  },
}
