import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function ParagraphsInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/paragraphs?function=init&parent="+parentID, p)
}

export function ParagraphUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/paragraph?function=update&id="+id, p)
}

export function ParagraphObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/paragraph?function=object&id="+id)
}

export function ParagraphsListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/paragraphs?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function ParagraphsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/paragraphs?function=count&parent="+parentID)
}

export function ParagraphOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/paragraph?function=order&mode="+mode+"&id="+id)
}

export function ParagraphDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/paragraph?id="+id)
}

export function ParagraphFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/paragraph?function="+func+"&id="+id)
}

export function ParagraphJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/paragraph?function=job&job="+job+"&id="+id)
}

// file handling

export function ParagraphUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/paragraph?function=upload&id="+id+"&mode="+mode, formData)
}

export function ParagraphInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/paragraphs?function=upload&parent="+parentID, formData)
}

// misc

export function ParagraphsChatGPTPOST(user, parentID, mode, payload) {
    return SessionFetch(user, "POST", "api/paragraphs?function=prompt&mode="+mode+"&parent="+parentID, payload)
}

export function ParagraphsChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/paragraphs?function=prompt&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

export function ParagraphAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/paragraph?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
