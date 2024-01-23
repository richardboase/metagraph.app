import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function BuildingsInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/buildings?function=init&parent="+parentID, p)
}

export function BuildingUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/building?function=update&id="+id, p)
}

export function BuildingObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/building?function=object&id="+id)
}

export function BuildingsListGET(user, parentID, limit) {
    return SessionFetch(user, "GET", "api/buildings?function=list&parent="+parentID+"&limit="+limit)
}

export function BuildingsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/buildings?function=count&parent="+parentID)
}

export function BuildingMoveUpPOST(user, id) {
    return SessionFetch(user, "POST", "api/building?function=up&id="+id)
}

export function BuildingMoveDownPOST(user, id) {
    return SessionFetch(user, "POST", "api/building?function=down&id="+id)
}

export function BuildingDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/building?id="+id)
}

export function BuildingFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/building?function="+func+"&id="+id)
}

// file handling

export function BuildingUpload(user, id, formData) {
    return AxiosPOST(user, "api/building?function=upload&id="+id, formData)
}

export function BuildingInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/buildings?function=initupload&parent="+parentID, formData)
}

export function BuildingInitUploads(user, parentID, formData) {
    return AxiosPOST(user, "api/buildings?function=inituploads&parent="+parentID, formData)
}

// misc

export function BuildingChatGPTModifyPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/openai?function=collectionprompt&collection="+collectionID+"&parent="+parentID, payload)
}

export function BuildingChatGPTInitPOST(user, parentID, payload) {
    return SessionFetch(user, "POST", "api/buildings?function=prompt&parent="+parentID, payload)
}