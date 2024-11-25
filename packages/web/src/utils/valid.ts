export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> }

export const validateLink = (link?: string) => {
  return String(link)
    .toLowerCase()
    .match(/http(s)?:\/\/([\w- ./?%&=]+)/)
}
export const validateEmail = (email?: string) => {
  console.log('validateEmail', email)
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

export const validateTelegram = (telegram?: string) => {
  // return String(telegram)
  //   .toLowerCase()
  //   .match(/^(http(s)?:\/\/t.me\/)?[a-zA-Z\-0-9]+$/)
  return telegram && telegram.split
}

export const validateDiscordUsername = (discord?: string) => {
  return String(discord)
    .toLowerCase()
    .match(/[^#]+#\d+$/)
}

export const validateDiscordAddress = (discord?: string) => {
  return String(discord)
    .toLowerCase()
    .match(/http(s)?:\/\/discord.com(\/[\w- ./?%&=]+)/)
}

export const validateDiscord = (discord?: string) => {
  return validateDiscordUsername(discord) || validateLink(discord)
}

export const MAX_NUMBER_INPUT = 1000000000000000
