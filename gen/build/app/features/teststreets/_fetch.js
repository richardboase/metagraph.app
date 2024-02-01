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

export function TeststreetsListGET(user, parentID, limit) {
    return SessionFetch(user, "GET", "api/teststreets?function=list&parent="+parentID+"&limit="+limit)
}

export function TeststreetsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/teststreets?function=count&parent="+parentID)
}

export function TeststreetMoveUpPOST(user, id) {
    return SessionFetch(user, "POST", "api/teststreet?function=up&id="+id)
}

export function TeststreetMoveDownPOST(user, id) {
    return SessionFetch(user, "POST", "api/teststreet?function=down&id="+id)
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

export function TeststreetUpload(user, id, formData) {
    return AxiosPOST(user, "api/teststreet?function=upload&id="+id, formData)
}

export function TeststreetInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/teststreets?function=initupload&parent="+parentID, formData)
}

export function TeststreetInitUploads(user, parentID, formData) {
    return AxiosPOST(user, "api/teststreets?function=inituploads&parent="+parentID, formData)
}

// misc

export function TeststreetChatGPTModifyPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/openai?function=collectionprompt&collection="+collectionID+"&parent="+parentID, payload)
}

export function TeststreetChatGPTInitPOST(user, parentID, payload) {
    return SessionFetch(user, "POST", "api/teststreets?function=prompt&parent="+parentID, payload)
}

export function TeststreetChatGPTPromptPOST(user, id, payload) {
    return SessionFetch(user, "POST", "api/teststreet?function=prompt&id="+id, payload)
}