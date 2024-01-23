import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function FloorsInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/floors?function=init&parent="+parentID, p)
}

export function FloorUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/floor?function=update&id="+id, p)
}

export function FloorObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/floor?function=object&id="+id)
}

export function FloorsListGET(user, parentID, limit) {
    return SessionFetch(user, "GET", "api/floors?function=list&parent="+parentID+"&limit="+limit)
}

export function FloorsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/floors?function=count&parent="+parentID)
}

export function FloorMoveUpPOST(user, id) {
    return SessionFetch(user, "POST", "api/floor?function=up&id="+id)
}

export function FloorMoveDownPOST(user, id) {
    return SessionFetch(user, "POST", "api/floor?function=down&id="+id)
}

export function FloorDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/floor?id="+id)
}

export function FloorFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/floor?function="+func+"&id="+id)
}

// file handling

export function FloorUpload(user, id, formData) {
    return AxiosPOST(user, "api/floor?function=upload&id="+id, formData)
}

export function FloorInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/floors?function=initupload&parent="+parentID, formData)
}

export function FloorInitUploads(user, parentID, formData) {
    return AxiosPOST(user, "api/floors?function=inituploads&parent="+parentID, formData)
}

// misc

export function FloorChatGPTModifyPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/openai?function=collectionprompt&collection="+collectionID+"&parent="+parentID, payload)
}

export function FloorChatGPTInitPOST(user, parentID, payload) {
    return SessionFetch(user, "POST", "api/floors?function=prompt&parent="+parentID, payload)
}