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

export function BookOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/book?function=order&mode="+mode+"&id="+id)
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

export function BookUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/book?function=upload&id="+id+"&mode="+mode, formData)
}

export function BooksUpload(user, parentID, mode, formData) {
    return AxiosPOST(user, "api/books?function=upload&parent="+parentID+"&mode="+mode, formData)
}

// misc

export function BooksChatGPTPOST(user, parentID, mode, payload) {
    return SessionFetch(user, "POST", "api/books?function=prompt&mode="+mode+"&parent="+parentID, payload)
}

export function BookAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/book?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}