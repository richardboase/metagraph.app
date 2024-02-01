import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function RoomsInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/rooms?function=init&parent="+parentID, p)
}

export function RoomUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/room?function=update&id="+id, p)
}

export function RoomObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/room?function=object&id="+id)
}

export function RoomsListGET(user, parentID, limit) {
    return SessionFetch(user, "GET", "api/rooms?function=list&parent="+parentID+"&limit="+limit)
}

export function RoomsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/rooms?function=count&parent="+parentID)
}

export function RoomMoveUpPOST(user, id) {
    return SessionFetch(user, "POST", "api/room?function=up&id="+id)
}

export function RoomMoveDownPOST(user, id) {
    return SessionFetch(user, "POST", "api/room?function=down&id="+id)
}

export function RoomDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/room?id="+id)
}

export function RoomFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/room?function="+func+"&id="+id)
}

export function RoomJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/room?function=job&job="+job+"&id="+id)
}

// file handling

export function RoomUpload(user, id, formData) {
    return AxiosPOST(user, "api/room?function=upload&id="+id, formData)
}

export function RoomInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/rooms?function=initupload&parent="+parentID, formData)
}

export function RoomInitUploads(user, parentID, formData) {
    return AxiosPOST(user, "api/rooms?function=inituploads&parent="+parentID, formData)
}

// misc

export function RoomChatGPTModifyPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/openai?function=collectionprompt&collection="+collectionID+"&parent="+parentID, payload)
}

export function RoomChatGPTInitPOST(user, parentID, payload) {
    return SessionFetch(user, "POST", "api/rooms?function=prompt&parent="+parentID, payload)
}

export function RoomChatGPTPromptPOST(user, id, payload) {
    return SessionFetch(user, "POST", "api/room?function=prompt&id="+id, payload)
}