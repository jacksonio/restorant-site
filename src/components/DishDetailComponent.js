import React, { Component } from 'react';

import { Card, CardImg, CardText, CardBody, CardTitle,
         Breadcrumb, BreadcrumbItem, Button, Modal,
         ModalHeader, ModalBody, Label, Row, Col } from 'reactstrap';

import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent'
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';


const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);

class CommentForm extends Component 
{
    constructor (props) 
    {
        super(props);
        this.state = { isModalOpen: false }

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModal()
    {
        this.setState({ isModalOpen: !this.state.isModalOpen });
    }

    handleSubmit(values) {
        console.log(values)
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.commentText, values.name);
    }

    render()
    {
        return(
            <>
            <Button className='mb-4' outline onClick={this.toggleModal}>
                    <span className='fa fa-pencil fa-lg'></span>Submit Comment
            </Button>

            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Col md={12}>
                                    <Label style={{ marginRight: '15px'}}  for="rating">Rating</Label>
                                    <Control.select   model=".rating" id="rating">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row>
                                    <Col md={12}>
                                        <Label htmlFor='name'>Your name</Label>
                                        <Control.text model=".name" id="name" name="name"
                                                placeholder="Name"
                                                className="form-control"
                                                validators={{
                                                    required, minLength: minLength(3), maxLength: maxLength(15)
                                                }}
                                                />
                                            <Errors
                                                className="text-danger"
                                                model=".name"
                                                show="touched"
                                                messages={{
                                                    required: 'Required',
                                                    minLength: 'Must be greater than 2 characters',
                                                    maxLength: 'Must be 15 characters or less'
                                                }}
                                            />
                                    </Col>
                            </Row>
                            
                            <Row>
                                <Col md={12}>
                                    <Label style={{ paddingLeft: '0'}} className='col-12' htmlFor='commentText'>Comment</Label>
                                    <Control.textarea model='.commentText' id="commentText" rows="6" cols='60' />
                                </Col>     
                            </Row>
                            <Button className='mt-3' type='submit' value='submit' color='primary'>Submit</Button>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </>
        );
    }
}

function RenderDish({ dish }) 
{
    return(
        <div className="col-12 col-sm-12 col-md-5 m-1">
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
            <Card>
                <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
            </FadeTransform>
        </div>
        
    );
}

function RenderComments({ comments, postComment, dishId })
{
    const dishComments = <Stagger in>
    {comments.map((comment) => {
        return (
            <Fade in>
                <li key={comment.id}>
                <p>{comment.comment}</p>
                <p>-- {comment.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                </li>
            </Fade>
        );
    })}
    </Stagger>

    return(
        <div className="col-12 col-sm-12 col-md-5 m-1">
            <h4>Comments</h4>
            <ul className="list-unstyled">
                {dishComments}
            </ul>
            <CommentForm dishId={dishId} postComment={postComment} />
        </div>
    );
}

const DishDetail = (props) => {
    if(props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        )
    } else if(props.errorMessage) {
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.errorMessage}</h4>
                </div>
            </div>
        )
    } else if (props.dish != null)
    {
        return(
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr/>
                    </div>
                </div>
                <div className="row">
                    <RenderDish dish={props.dish}/>
                    <RenderComments 
                        comments={props.comments} 
                        postComment={props.postComment} 
                        dishId={props.dishId} />        
                </div>
            </div>
        );
    }
    else
    {
        return(<div></div>);
    } 
}

export default DishDetail;