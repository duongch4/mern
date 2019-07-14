import * as React from "react";
import { ProgressBar } from "./ProgressBar";

interface IProgressViewState {
    isFailed: boolean;
    isLoading: boolean;
}

interface IProgressViewProps {
    promise: Promise<any>;
    content?: () => any;
}

export class ProgressView extends React.Component<IProgressViewProps, IProgressViewState> {

    constructor(props: IProgressViewProps) {
        super(props);
        this.state = {
            isFailed: false,
            isLoading: true,
        };
    }

    public componentDidMount() {
        if (this.props.promise) {
            this.asignToPromise(this.props);
        }
    }

    public componentWillReceiveProps(newProps: IProgressViewProps) {
        if (newProps.promise !== this.props.promise) {
            this.asignToPromise(newProps);
        }
    }

    public async asignToPromise(newProps: IProgressViewProps): Promise<void> {
        if (newProps.promise !== null) {
            try {
                await newProps.promise;
                this.setState({
                    isLoading: false,
                });
            } catch (err) {
                // TODO: report this
                // console.log(err);
                this.setState({
                    isFailed: true,
                });
            }
        }
    }

    public render() {
        if (this.state.isFailed) {
            return <div/>;
        }

        if (this.state.isLoading) {
            return <ProgressBar />;
        }

        return this.props.content();
    }
}
