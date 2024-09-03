import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function HealthcheckupsInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/healthcheckups?function=init&parent="+parentID, p)
}

export function HealthcheckupUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/healthcheckup?function=update&id="+id, p)
}

export function HealthcheckupObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/healthcheckup?function=object&id="+id)
}

export function HealthcheckupsListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/healthcheckups?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function HealthcheckupsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/healthcheckups?function=count&parent="+parentID)
}

export function HealthcheckupOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/healthcheckup?function=order&mode="+mode+"&id="+id)
}

export function HealthcheckupDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/healthcheckup?id="+id)
}

export function HealthcheckupFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/healthcheckup?function="+func+"&id="+id)
}

export function HealthcheckupJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/healthcheckup?function=job&job="+job+"&id="+id)
}

// file handling

export function HealthcheckupUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/healthcheckup?function=upload&id="+id+"&mode="+mode, formData)
}

export function HealthcheckupInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/healthcheckups?function=upload&parent="+parentID, formData)
}

// misc

export function HealthcheckupsModelsPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/healthcheckups?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function HealthcheckupsChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/healthcheckups?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function HealthcheckupAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/healthcheckup?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
