export const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
export const nameRegex = /^(?=.{3,}$)[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$/
export const ipRegex = /^(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)){3}$/
export const pathRegex = /^\/(?:[a-zA-Z0-9_-]+\/?)*$/