export type TUserResponse = {
  email: string
  id: string
}

export type TRefreshTokenResponse = {
  success: boolean
  accessToken: string
}

export type TInitializeResponse = {
  success: boolean
  data: TUserResponse
}
