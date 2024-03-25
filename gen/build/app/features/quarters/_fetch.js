import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function QuartersInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/quarters?function=init&parent="+parentID, p)
}

export function QuarterUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/quarter?function=update&id="+id, p)
}

export function QuarterObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/quarter?function=object&id="+id)
}

export function QuartersListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/quarters?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function QuartersCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/quarters?function=count&parent="+parentID)
}

export function QuarterOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/quarter?function=order&mode="+mode+"&id="+id)
}

export function QuarterDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/quarter?id="+id)
}

export function QuarterFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/quarter?function="+func+"&id="+id)
}

export function QuarterJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/quarter?function=job&job="+job+"&id="+id)
}

// file handling

export function QuarterUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/quarter?function=upload&id="+id+"&mode="+mode, formData)
}

export function QuarterInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/quarters?function=upload&parent="+parentID, formData)
}

// misc

export function QuartersChatGPTPOST(user, parentID, mode, payload) {
    return SessionFetch(user, "POST", "api/quarters?function=openai&mode="+mode+"&parent="+parentID, payload)
}

export function QuartersVertexPOST(user, parentID, mode, payload) {
    return SessionFetch(user, "POST", "api/quarters?function=vertex&mode="+mode+"&parent="+parentID, payload)
}

export function QuartersChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/quarters?function=openai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function QuarterAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/quarter?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
