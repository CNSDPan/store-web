import request from '@/util/request.js'

export function storeItem(data) {
    return request({
        url: '/v1/client/store/list',
        method: 'post',
        data
    })
}

export function storeInfo(data) {
    return request({
        url: '/v1/client/store/info',
        method: 'post',
        data
    })
}

export function memberJoin(data) {
    return request({
        url: '/v1/client/store/member/join',
        method: 'post',
        data
    })
}

export function initChatLog(data) {
    return request({
        url: '/v1/client/store/chat/init',
        method: 'post',
        data
    })
}

export function getChatLog(data) {
    return request({
        url: '/v1/client/store/chat/',
        method: 'post',
        data
    })
}