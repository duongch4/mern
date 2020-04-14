import React, { Component } from "react";
import homeImg from "../../assets/png/titleImg.png";
import { AjaxHandler, TGenericObject } from "../../utils/AjaxHandler";
import { AlertMessage } from "../utils/AlertMessage";
import { JsonPrint } from "../utils/JsonPrint";

type HomeState = {
    message: string;
    reqBody: TGenericObject<any>;
    resData: {};
    loading: number;
};

export class Home extends Component<any, HomeState> {

    public readonly state: Readonly<HomeState> = {
        message: "",
        reqBody: {},
        resData: {},
        loading: 0
    };

    public render() {
        return (
            <div id="home" className="container-fluid">
                <div className="row">
                    <div className="col-md-4 img-sect d-none d-md-block">
                        <img src={homeImg} className="home-img img-fluid" alt="HomeImage" />
                        <input type="button" onClick={this.onClick1} value="Testing GraphQL: Simple Query" />
                        <input type="button" onClick={this.onClick2} value="Testing GraphQL: Aliases and Fragment" />
                        <input type="button" onClick={this.onClick3} value="Testing GraphQL: Mutation" />
                        <AlertMessage message={this.state.message} />
                    </div>
                    <div className="col-md-8 d-none d-md-block">
                        Request Body
                        <JsonPrint data={this.state.reqBody} />
                        <hr />
                        Response Data
                        <JsonPrint data={this.state.resData} />
                    </div>
                </div>
            </div>
        );
    }

    private onClick1 = () => {
        this.setState({ loading: 0 });
        this.onClick11();
    }

    private onClick2 = () => {
        this.setState({ loading: 0 });
        this.onClick22();
    }

    private onClick3 = () => {
        // this.setState({ loading: 0 });
        this.onClick33();
    }

    private onClick11 = async () => {
        const query: string = `
            query getSingleCourse($courseID: Int!) {
                course(id: $courseID) {
                    title
                    author
                    description
                    topic
                    url
                }
            }
        `;

        const variables = {
            courseID: 1
        };

        const data = {
            query: query,
            variables: variables
        };

        try {
            const response = await AjaxHandler.postRequest("/api/graphql", data);
            this.setState({ message: "Success", reqBody: data, resData: response, loading: 100 });
        }
        catch (err) {
            this.setState({ message: err.message, reqBody: data, resData: err });
        }
    }

    private onClick22 = async () => {
        const query: string = `
            query getCourseWithFragments($courseID1: Int!, $courseID2: Int!) {
                course1: course(id: $courseID1) {
                    ...courseFields
                },
                course2: course(id: $courseID2) {
                    ...courseFields
                }
            }
            fragment courseFields on Course {
                title
                author
                description
                topic
                url
            }
        `;

        const variables = {
            courseID1: 1,
            courseID2: 2
        };

        const data = {
            query: query,
            variables: variables
        };

        try {
            const response = await AjaxHandler.postRequest("/api/graphql", data);
            this.setState({ message: "Success", reqBody: data, resData: response, loading: 100 });
        }
        catch (err) {
            this.setState({ message: err.message, reqBody: data, resData: err });
        }
    }

    private onClick33 = async () => {
        const query: string = `
            mutation updateCourseTopic($id: Int!, $topic: String!) {
                updateCourseTopic(id: $id, topic: $topic) {
                    ... courseFields
                }
            }
            fragment courseFields on Course {
                title
                author
                description
                topic
                url
            }
        `;

        const variables = {
            id: 1,
            topic: "JS"
        };

        const data = {
            query: query,
            variables: variables
        };

        try {
            const response = await AjaxHandler.postRequest("/api/graphql", data);
            this.setState({ message: "Success", reqBody: data, resData: response, loading: 100 });
        }
        catch (err) {
            this.setState({ message: err.message, reqBody: data, resData: err });
        }
    }
}
