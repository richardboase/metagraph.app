import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function GamingcarddetailssInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/gamingcarddetailss?function=init&parent="+parentID, p)
}

export function GamingcarddetailsUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/gamingcarddetails?function=update&id="+id, p)
}

export function GamingcarddetailsObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/gamingcarddetails?function=object&id="+id)
}

export function GamingcarddetailssListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/gamingcarddetailss?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function GamingcarddetailssCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/gamingcarddetailss?function=count&parent="+parentID)
}

export function GamingcarddetailsOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/gamingcarddetails?function=order&mode="+mode+"&id="+id)
}

export function GamingcarddetailsDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/gamingcarddetails?id="+id)
}

export function GamingcarddetailsFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/gamingcarddetails?function="+func+"&id="+id)
}

export function GamingcarddetailsJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/gamingcarddetails?function=job&job="+job+"&id="+id)
}

// file handling

export function GamingcarddetailsUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/gamingcarddetails?function=upload&id="+id+"&mode="+mode, formData)
}

export function GamingcarddetailsInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/gamingcarddetailss?function=upload&parent="+parentID, formData)
}

// misc

export function GamingcarddetailssModelsPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/gamingcarddetailss?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function GamingcarddetailssChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/gamingcarddetailss?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function GamingcarddetailsAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/gamingcarddetails?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
