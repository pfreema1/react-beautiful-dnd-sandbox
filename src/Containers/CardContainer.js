// @flow
import React, { Component } from "react";
import styled from "styled-components";
import { Motion, spring } from "react-motion";

interface CardContainerProps {
  dragStarted: boolean;
  dragStartHandled(): void;
  item: Item;
}

interface CardContainerState {
  dragStarted: boolean;
  key: number;
}

interface Item {
  id: string;
}

const Card = styled.div`
  user-select: none;
  padding: 16px;
  margin: 0 0 8px 0;
`;

const getItemStyle = (isDragging, draggableStyle, rotDeg) => {
  console.log(parseInt(rotDeg));
  return {
    //change bg color if dragging
    background: isDragging ? "lightgreen" : "grey",
    // style={{ transform: `rotate(${interpStyle.rotDeg}deg)` }}
    transform: "rotate(" + parseInt(rotDeg) + "deg)", //`rotate(${rotDeg}deg)`,
    //styles we need to apply on draggables
    ...draggableStyle
  };
};

class CardContainer extends React.Component<
  CardContainerProps,
  CardContainerState
> {
  constructor(props: CardContainerProps) {
    super(props);

    this.state = {
      dragStarted: props.dragStarted,
      key: 10
    };
  }

  componentWillReceiveProps(nextProps: CardContainerProps) {
    if (nextProps.dragStarted !== this.state.dragStarted) {
      this.setState({
        dragStarted: nextProps.dragStarted
      });
    }
  }

  handleDragStarted = () => {
    console.log("handling drag STARTED IENIDNIDD");
    this.setState({
      key: this.state.key + 1
    });

    //reset state in parent
    this.props.dragStartHandled();
  };

  render() {
    const { provided } = this.props;
    const { snapshot } = this.props;
    return (
      <div>
        <Motion
          key={this.state.key}
          defaultStyle={{ rotDeg: 0 }}
          style={{ rotDeg: spring(20, { stiffness: 30, damping: 17 }) }}
        >
          {interpStyle => {
            return (
              <Card
                innerRef={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                //function to handle conditional styles
                style={getItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style,
                  interpStyle.rotDeg
                )}
              >
                {/*listen for drag start and play animation*/}
                {this.state.dragStarted ? this.handleDragStarted() : null}
                meow {this.props.item.id}
              </Card>
            );
          }}
        </Motion>
        {provided.placeholder}
      </div>
    );
  }
}

export default CardContainer;
