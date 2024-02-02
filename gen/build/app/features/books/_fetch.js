import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function BooksInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/books?function=init&parent="+parentID, p)
}

export function BookUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/book?function=update&id="+id, p)
}

export function BookObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/book?function=object&id="+id)
}

export function BooksListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/books?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function BooksCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/books?function=count&parent="+parentID)
}

export function BookMoveUpPOST(user, id) {
    return SessionFetch(user, "POST", "api/book?function=up&id="+id)
}

export function BookMoveDownPOST(user, id) {
    return SessionFetch(user, "POST", "api/book?function=down&id="+id)
}

export function BookDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/book?id="+id)
}

export function BookFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/book?function="+func+"&id="+id)
}

export function BookJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/book?function=job&job="+job+"&id="+id)
}

// file handling

export function BookUpload(user, id, formData) {
    return AxiosPOST(user, "api/book?function=upload&id="+id, formData)
}

export function BookInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/books?function=initupload&parent="+parentID, formData)
}

export function BookInitUploads(user, parentID, formData) {
    return AxiosPOST(user, "api/books?function=inituploads&parent="+parentID, formData)
}

// misc

export function BookChatGPTModifyPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/openai?function=collectionprompt&collection="+collectionID+"&parent="+parentID, payload)
}

export function BookChatGPTInitPOST(user, parentID, payload) {
    return SessionFetch(user, "POST", "api/books?function=prompt&parent="+parentID, payload)
}

export function BookChatGPTPromptPOST(user, id, payload) {
    return SessionFetch(user, "POST", "api/book?function=prompt&id="+id, payload)
}

export function BookAdminAddPOST(user, id, payload) {
    return SessionFetch(user, "POST", "api/book?function=addadmin&id="+id, payload)
}

export function BookAdminRemovePOST(user, id, payload) {
    return SessionFetch(user, "POST", "api/book?function=removeadmin&id="+id, payload)
}