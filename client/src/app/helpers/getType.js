import types from './types'

const getType = (value, t) => types(t).find(type => type.value === value)

export default getType
