import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function FurnishingsInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/furnishings?function=init&parent="+parentID, p)
}

export function FurnishingUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/furnishing?function=update&id="+id, p)
}

export function FurnishingObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/furnishing?function=object&id="+id)
}

export function FurnishingsListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/furnishings?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function FurnishingsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/furnishings?function=count&parent="+parentID)
}

export function FurnishingOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/furnishing?function=order&mode="+mode+"&id="+id)
}

export function FurnishingDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/furnishing?id="+id)
}

export function FurnishingFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/furnishing?function="+func+"&id="+id)
}

export function FurnishingJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/furnishing?function=job&job="+job+"&id="+id)
}

// file handling

export function FurnishingUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/furnishing?function=upload&id="+id+"&mode="+mode, formData)
}

export function FurnishingInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/furnishings?function=upload&parent="+parentID, formData)
}

// misc

export function FurnishingsModelšPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/furnishings?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function FurnishingsChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/furnishings?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function FurnishingAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/furnishing?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
