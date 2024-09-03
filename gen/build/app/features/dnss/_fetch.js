import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function DnssInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/dnss?function=init&parent="+parentID, p)
}

export function DnsUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/dns?function=update&id="+id, p)
}

export function DnsObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/dns?function=object&id="+id)
}

export function DnssListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/dnss?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function DnssCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/dnss?function=count&parent="+parentID)
}

export function DnsOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/dns?function=order&mode="+mode+"&id="+id)
}

export function DnsDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/dns?id="+id)
}

export function DnsFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/dns?function="+func+"&id="+id)
}

export function DnsJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/dns?function=job&job="+job+"&id="+id)
}

// file handling

export function DnsUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/dns?function=upload&id="+id+"&mode="+mode, formData)
}

export function DnsInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/dnss?function=upload&parent="+parentID, formData)
}

// misc

export function DnssModelsPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/dnss?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function DnssChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/dnss?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function DnsAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/dns?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
