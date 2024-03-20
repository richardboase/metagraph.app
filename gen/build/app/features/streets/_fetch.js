import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function StreetsInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/streets?function=init&parent="+parentID, p)
}

export function StreetUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/street?function=update&id="+id, p)
}

export function StreetObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/street?function=object&id="+id)
}

export function StreetsListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/streets?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function StreetsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/streets?function=count&parent="+parentID)
}

export function StreetOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/street?function=order&mode="+mode+"&id="+id)
}

export function StreetDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/street?id="+id)
}

export function StreetFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/street?function="+func+"&id="+id)
}

export function StreetJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/street?function=job&job="+job+"&id="+id)
}

// file handling

export function StreetUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/street?function=upload&id="+id+"&mode="+mode, formData)
}

export function StreetInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/streets?function=upload&parent="+parentID, formData)
}

// misc

export function StreetsChatGPTPOST(user, parentID, mode, payload) {
    return SessionFetch(user, "POST", "api/streets?function=openai&mode="+mode+"&parent="+parentID, payload)
}

export function StreetsChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/streets?function=openai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function StreetAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/street?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
