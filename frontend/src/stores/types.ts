export type LoginCredentials = {
  email: string
  password: string
}

export type Image = {
  path: string
}

export type RegisterUser = {
  email: string
  username: string
  password: string
  passwordConfirm: string
}

export type UserInfo = {
  name: string
  email: string
  id: number
}
