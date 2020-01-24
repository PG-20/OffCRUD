import {useMutation} from "@apollo/react-hooks";
import {addProductUpdate, deleteProductUpdate, editProductUpdate} from "./updateFunctions";

const uuidv4 = require('uuid/v4');

export default function useOfflineMutation(mutation, options) {
    options.onCompleted = async (data) => {
        console.log(data);
        const pending = await getPending();
        await setPending(pending.slice(0,-1));
    };
    const [mutate, details] = useMutation(mutation, options);
    const offlineMutate = (mutateOptions) => {
        const id = uuidv4();
        mutateOptions.optimisticResponse.__optimistic = true;
        (async () => {
            const pending = await getPending();
            pending.push({id, mutateOptions, mutation});
            await setPending(pending);
        })();
        mutate(mutateOptions);
    };
    return [offlineMutate, details];
}

export async function getPending() {
    return JSON.parse(localStorage.getItem("KEY")) || []
}

export function restoreRequests(client) {
    getPending().then((pending) => {
        pending.forEach(({id, mutateOptions: options, mutation}) => {
            options.optimisticResponse.__optimistic = true;
            options.update = proxyUpdateForId(id);
            options.mutation = mutation;
            client.mutate(options)
        })
    })
}

// Store serialized mutations in localstorage
export function setPending(mutations) {
    localStorage.setItem("KEY", JSON.stringify(mutations))
}

// Delegate incoming responses to the correct update function
function updateHandler(resp) {
    // IMPORTANT: You need one of these for every custom update function you use!
    if (resp.data.added) {
        return addProductUpdate;
    } else if (resp.data.editProduct) {
        return editProductUpdate;
    } else if (resp.data.deletedID) {
        return deleteProductUpdate;
    } else return () => {}
}

// Return a dummy update function scoped to a request with a specific id
function proxyUpdateForId(id) {
    return (proxy, resp) => {
        updateHandler(resp)(proxy, resp);
        if (!resp.data.__optimistic) {
            getPending().then(pending => {
                    setPending(pending.filter(mutation => mutation.id !== id));
                }
            )
        }
    }
}
