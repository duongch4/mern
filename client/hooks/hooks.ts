import React from "react";

enum AsyncStatusType {
    EMPTY = "EMPTY",
    LOADING = "LOADING",
    FAILURE = "FAILURE",
    SUCCESS = "SUCCESS"
}

type AsyncState<DataType> =
    | { status: AsyncStatusType.EMPTY }
    | { status: AsyncStatusType.LOADING }
    | { status: AsyncStatusType.FAILURE; error: any }
    | { status: AsyncStatusType.SUCCESS; data: DataType };

enum AsyncActionType {
    REQUEST = "REQUEST",
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE"
}

type AsyncAction<DataType> =
    | { type: AsyncActionType.REQUEST }
    | { type: AsyncActionType.FAILURE; error: any }
    | { type: AsyncActionType.SUCCESS; data: DataType };

const useSafeDispatch = <A, >(dispatch: React.Dispatch<A>) => {
    const mounted = React.useRef(false);
    React.useLayoutEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);
    return React.useCallback(
        (action: A) => (mounted.current ? dispatch(action) : void 0),
        [dispatch],
    );
};

const reducer = <DataType, >(_state: AsyncState<DataType>, action: AsyncAction<DataType>): AsyncState<DataType> => {
    switch (action.type) {
        case AsyncActionType.REQUEST: return { status: AsyncStatusType.LOADING };
        case AsyncActionType.FAILURE: return { status: AsyncStatusType.FAILURE, error: action.error };
        case AsyncActionType.SUCCESS: return { status: AsyncStatusType.SUCCESS, data: action.data };
        default: throw new Error();
    }
};

// Example usage:
// const {data, error, status, run} = useAsync()
// React.useEffect(() => {
//   run(fetchPokemon(pokemonName))
// }, [pokemonName, run])

const useAsync = <DataType, >(initialState: AsyncState<DataType> = { status: AsyncStatusType.EMPTY }) => {
    const initialStateRef = React.useRef<AsyncState<DataType>>(initialState);

    const [state, dispatch] = React.useReducer<React.Reducer<AsyncState<DataType>, AsyncAction<DataType>>>(reducer, initialStateRef.current);

    const safeDisPatch = useSafeDispatch(dispatch);

    const dispatchData = React.useCallback(
        (data: DataType) => safeDisPatch({ type: AsyncActionType.SUCCESS, data }),
        [safeDisPatch],
    );
    const dispatchError = React.useCallback(
        (error: any) => safeDisPatch({ type: AsyncActionType.FAILURE, error }),
        [safeDisPatch],
    );
    const dispatchReset = React.useCallback(
        () => safeDisPatch({ type: AsyncActionType.REQUEST }),
        [safeDisPatch]
    );

    const run = React.useCallback(
        (promise: Promise<any>) => {
            if (!promise || !promise.then) {
                throw new Error(
                    `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`,
                );
            }
            safeDisPatch({ type: AsyncActionType.REQUEST });
            return promise.then(
                (data: DataType) => {
                    dispatchData(data);
                    return data;
                },
                (error) => {
                    dispatchError(error);
                    return error;
                },
            );
        },
        [safeDisPatch, dispatchData, dispatchError],
    );

    return {
        // using the same names that react-query uses for convenience
        isEmpty: state.status === AsyncStatusType.EMPTY,
        isLoading: state.status === AsyncStatusType.LOADING,
        isError: state.status === AsyncStatusType.FAILURE,
        isSuccess: state.status === AsyncStatusType.SUCCESS,

        state,
        dispatchData,
        dispatchError,
        dispatchReset,
        run
    };
};

export { useAsync, AsyncState, AsyncStatusType };
