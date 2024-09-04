import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function PicturedetailssInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/picturedetailss?function=init&parent="+parentID, p)
}

export function PicturedetailsUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/picturedetails?function=update&id="+id, p)
}

export function PicturedetailsObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/picturedetails?function=object&id="+id)
}

export function PicturedetailssListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/picturedetailss?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function PicturedetailssCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/picturedetailss?function=count&parent="+parentID)
}

export function PicturedetailsOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/picturedetails?function=order&mode="+mode+"&id="+id)
}

export function PicturedetailsDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/picturedetails?id="+id)
}

export function PicturedetailsFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/picturedetails?function="+func+"&id="+id)
}

export function PicturedetailsJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/picturedetails?function=job&job="+job+"&id="+id)
}

// file handling

export function PicturedetailsUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/picturedetails?function=upload&id="+id+"&mode="+mode, formData)
}

export function PicturedetailsInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/picturedetailss?function=upload&parent="+parentID, formData)
}

// misc

export function PicturedetailssModelsPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/picturedetailss?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function PicturedetailssChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/picturedetailss?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function PicturedetailsAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/picturedetails?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
