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

export function BuildingsListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/buildings?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function BuildingsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/buildings?function=count&parent="+parentID)
}

export function BuildingOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/building?function=order&mode="+mode+"&id="+id)
}

export function BuildingDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/building?id="+id)
}

export function BuildingFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/building?function="+func+"&id="+id)
}

export function BuildingJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/building?function=job&job="+job+"&id="+id)
}

// file handling

export function BuildingUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/building?function=upload&id="+id+"&mode="+mode, formData)
}

export function BuildingInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/buildings?function=upload&parent="+parentID, formData)
}

// misc

export function BuildingsChatGPTPOST(user, parentID, mode, payload) {
    return SessionFetch(user, "POST", "api/buildings?function=prompt&mode="+mode+"&parent="+parentID, payload)
}

export function BuildingsChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/buildings?function=prompt&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

export function BuildingAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/building?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
