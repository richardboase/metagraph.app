import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function ThingsInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/things?function=init&parent="+parentID, p)
}

export function ThingUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/thing?function=update&id="+id, p)
}

export function ThingObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/thing?function=object&id="+id)
}

export function ThingsListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/things?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function ThingsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/things?function=count&parent="+parentID)
}

export function ThingOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/thing?function=order&mode="+mode+"&id="+id)
}

export function ThingDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/thing?id="+id)
}

export function ThingFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/thing?function="+func+"&id="+id)
}

export function ThingJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/thing?function=job&job="+job+"&id="+id)
}

// file handling

export function ThingUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/thing?function=upload&id="+id+"&mode="+mode, formData)
}

export function ThingInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/things?function=upload&parent="+parentID, formData)
}

// misc

export function ThingsModelsPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/things?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function ThingsChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/things?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function ThingAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/thing?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
