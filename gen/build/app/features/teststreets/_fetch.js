import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function TeststreetsInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/teststreets?function=init&parent="+parentID, p)
}

export function TeststreetUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/teststreet?function=update&id="+id, p)
}

export function TeststreetObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/teststreet?function=object&id="+id)
}

export function TeststreetsListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/teststreets?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function TeststreetsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/teststreets?function=count&parent="+parentID)
}

export function TeststreetOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/teststreet?function=order&mode="+mode+"&id="+id)
}

export function TeststreetDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/teststreet?id="+id)
}

export function TeststreetFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/teststreet?function="+func+"&id="+id)
}

export function TeststreetJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/teststreet?function=job&job="+job+"&id="+id)
}

// file handling

export function TeststreetUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/teststreet?function=upload&id="+id+"&mode="+mode, formData)
}

export function TeststreetInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/teststreets?function=upload&parent="+parentID, formData)
}

// misc

export function TeststreetsModelšPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/teststreets?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function TeststreetsChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/teststreets?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function TeststreetAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/teststreet?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
