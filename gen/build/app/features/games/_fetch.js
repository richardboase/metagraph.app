import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function GamesInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/games?function=init&parent="+parentID, p)
}

export function GameUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/game?function=update&id="+id, p)
}

export function GameObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/game?function=object&id="+id)
}

export function GamesListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/games?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function GamesCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/games?function=count&parent="+parentID)
}

export function GameOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/game?function=order&mode="+mode+"&id="+id)
}

export function GameDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/game?id="+id)
}

export function GameFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/game?function="+func+"&id="+id)
}

export function GameJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/game?function=job&job="+job+"&id="+id)
}

// file handling

export function GameUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/game?function=upload&id="+id+"&mode="+mode, formData)
}

export function GameInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/games?function=upload&parent="+parentID, formData)
}

// misc

export function GamesModelsPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/games?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function GamesChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/games?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function GameAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/game?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
