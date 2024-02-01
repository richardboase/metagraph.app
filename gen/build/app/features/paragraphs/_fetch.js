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

export function ParagraphsListGET(user, parentID, limit) {
    return SessionFetch(user, "GET", "api/paragraphs?function=list&parent="+parentID+"&limit="+limit)
}

export function ParagraphsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/paragraphs?function=count&parent="+parentID)
}

export function ParagraphMoveUpPOST(user, id) {
    return SessionFetch(user, "POST", "api/paragraph?function=up&id="+id)
}

export function ParagraphMoveDownPOST(user, id) {
    return SessionFetch(user, "POST", "api/paragraph?function=down&id="+id)
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

export function ParagraphUpload(user, id, formData) {
    return AxiosPOST(user, "api/paragraph?function=upload&id="+id, formData)
}

export function ParagraphInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/paragraphs?function=initupload&parent="+parentID, formData)
}

export function ParagraphInitUploads(user, parentID, formData) {
    return AxiosPOST(user, "api/paragraphs?function=inituploads&parent="+parentID, formData)
}

// misc

export function ParagraphChatGPTModifyPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/openai?function=collectionprompt&collection="+collectionID+"&parent="+parentID, payload)
}

export function ParagraphChatGPTInitPOST(user, parentID, payload) {
    return SessionFetch(user, "POST", "api/paragraphs?function=prompt&parent="+parentID, payload)
}

export function ParagraphChatGPTPromptPOST(user, id, payload) {
    return SessionFetch(user, "POST", "api/paragraph?function=prompt&id="+id, payload)
}