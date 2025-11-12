export type UrlQueryFragment = [string, string]

export namespace UrlQueryFragment {
  export function create(key: string, value: string): UrlQueryFragment {
    return [key, value]
  }
}

export type UrlQuery = UrlQueryFragment[]

export namespace UrlQuery {
  export function build(urlQuery: UrlQuery) {
    return urlQuery
      .map(keyValue => {
        const [key, value] = keyValue
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      })
      .join("&")
  }
}
