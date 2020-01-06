// import React, { Component } from "react";
// import { ProgressBar } from "./ProgressBar";

// type ProgressViewState = {
//     isFailed: boolean;
//     isLoading: boolean;
// };

// type ProgressViewProps = {
//     promise: Promise<any>;
//     content: () => any;
// };

// export class ProgressView extends Component<ProgressViewProps, ProgressViewState> {

//     constructor(props: ProgressViewProps) {
//         super(props);
//         this.state = {
//             isFailed: false,
//             isLoading: true,
//         };
//     }

//     componentDidMount() {
//         if (this.props.promise) {
//             this.asignToPromise(this.props);
//         }
//     }

//     componentWillReceiveProps(newProps: ProgressViewProps) {
//         if (newProps.promise !== this.props.promise) {
//             this.asignToPromise(newProps);
//         }
//     }

//     async asignToPromise(newProps: ProgressViewProps): Promise<void> {
//         if (newProps.promise !== null) {
//             try {
//                 await newProps.promise;
//                 this.setState({
//                     isLoading: false,
//                 });
//             } catch (err) {
//                 // TODO: report this
//                 // console.log(err);
//                 this.setState({
//                     isFailed: true,
//                 });
//             }
//         }
//     }

//     render() {
//         if (this.state.isFailed) {
//             return <div />;
//         }

//         if (this.state.isLoading) {
//             return <ProgressBar />;
//         }

//         return this.props.content();
//     }
// }
