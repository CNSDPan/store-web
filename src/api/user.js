import request from '@/util/request.js'


export function userListInit(data) {
    return request({
        url: '/api/user/list',
        method: 'post',
        data
    })
}

export function userLogin(data) {
    return request({
        url: '/v1/client/user/login',
        method: 'post',
        data
    })
}

export function userRegister(data) {
    return request({
        url: '/v1/client/user/register',
        method: 'post',
        data
    })
}

export function userInfo(data) {
    return request({
        url: '/v1/client/user/info',
        method: 'post',
        data
    })
}