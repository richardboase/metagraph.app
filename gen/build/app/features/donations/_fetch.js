import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function DonationsInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/donations?function=init&parent="+parentID, p)
}

export function DonationUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/donation?function=update&id="+id, p)
}

export function DonationObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/donation?function=object&id="+id)
}

export function DonationsListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/donations?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function DonationsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/donations?function=count&parent="+parentID)
}

export function DonationOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/donation?function=order&mode="+mode+"&id="+id)
}

export function DonationDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/donation?id="+id)
}

export function DonationFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/donation?function="+func+"&id="+id)
}

export function DonationJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/donation?function=job&job="+job+"&id="+id)
}

// file handling

export function DonationUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/donation?function=upload&id="+id+"&mode="+mode, formData)
}

export function DonationInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/donations?function=upload&parent="+parentID, formData)
}

// misc

export function DonationsModelsPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/donations?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function DonationsChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/donations?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function DonationAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/donation?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
