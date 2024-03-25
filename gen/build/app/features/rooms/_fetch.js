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

export function RoomsListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/rooms?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function RoomsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/rooms?function=count&parent="+parentID)
}

export function RoomOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/room?function=order&mode="+mode+"&id="+id)
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

export function RoomUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/room?function=upload&id="+id+"&mode="+mode, formData)
}

export function RoomInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/rooms?function=upload&parent="+parentID, formData)
}

// misc

export function RoomsChatGPTPOST(user, parentID, mode, payload) {
    return SessionFetch(user, "POST", "api/rooms?function=openai&mode="+mode+"&parent="+parentID, payload)
}

export function RoomsVertexPOST(user, parentID, mode, payload) {
    return SessionFetch(user, "POST", "api/rooms?function=vertex&mode="+mode+"&parent="+parentID, payload)
}

export function RoomsChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/rooms?function=openai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function RoomAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/room?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
