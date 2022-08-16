import React, { ReactElement, ReactNode } from "react"
import { hardShadow } from "convose-styles"
import {
  Description,
  Title,
  Wrapper,
  Modal,
  Icon,
  ButtonsContainer,
} from "./Styled"
import { ButtonType, AlertButton } from "./AlertButton"

type ShowProps = {
  icon?: ReactElement | null
  ioniconName?: string
  title?: string | ReactElement
  description?: string | ReactElement
  buttons?: ButtonType[]
}
type State = ShowProps & {
  isVisible: boolean
}
type Props = ShowProps & {
  isVisible?: boolean
}

export class ConvoseAlert extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    const state = this.initState()
    this.state = state
  }

  componentDidUpdate(prevProps: Props): void {
    const { isVisible } = this.props
    if (!prevProps.isVisible && isVisible) {
      this.setVisible()
    }
  }

  private initState = (): State => {
    const {
      isVisible,
      ioniconName,
      title,
      description,
      buttons,
      icon,
    } = this.props
    return {
      isVisible: isVisible || false,
      ioniconName: ioniconName || "",
      title: title || "",
      description: description || "",
      buttons: buttons || [],
      icon: icon || null,
    }
  }

  private setInvisible = (): void => {
    this.setState({
      isVisible: false,
    })
  }

  private setVisible = (): void => {
    this.setState({
      isVisible: true,
    })
  }

  private renderButtons = (): ReactNode => {
    const { buttons } = this.state
    if (buttons?.length) {
      const buttonLength = buttons.length
      return (
        <ButtonsContainer>
          {buttons.map((button: ButtonType, index) => {
            return (
              <AlertButton
                // eslint-disable-next-line react/no-array-index-key
                key={`${button.title}-${index}`}
                title={button.title}
                onPress={() => {
                  this.setInvisible()
                  if (typeof button.onPress === "function") {
                    button.onPress()
                  }
                }}
                type={button.type}
                isLast={index + 1 === buttonLength}
              />
            )
          })}
        </ButtonsContainer>
      )
    }
    return (
      <ButtonsContainer>
        <AlertButton title="OK" onPress={this.setInvisible} />
      </ButtonsContainer>
    )
  }

  public show = (props: ShowProps): void => {
    const { buttons, description, ioniconName, title } = props
    this.setState({
      buttons,
      description,
      ioniconName,
      title,
      isVisible: true,
    })
  }

  public tryRenderComponent = (
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    Container: any,
    field?: string | ReactElement
  ): ReactNode | null => {
    if (!field) {
      return null
    }
    if (typeof field === "string") {
      return <Container>{field}</Container>
    }
    return field
  }

  public renderTitle = (): ReactNode | null => {
    const { title } = this.state
    return this.tryRenderComponent(Title, title)
  }

  public renderDescription = (): ReactNode | null => {
    const { description } = this.state
    return this.tryRenderComponent(Description, description)
  }

  public renderIcon = (): ReactNode | null => {
    const { icon, ioniconName } = this.state
    if (ioniconName) {
      return <Icon name={ioniconName} size={45} />
    }
    if (icon) {
      return icon
    }
    return null
  }

  render(): ReactNode {
    const { isVisible } = this.state
    if (!isVisible) {
      return null
    }
    return (
      <Wrapper>
        <Modal style={hardShadow}>
          {this.renderIcon()}
          {this.renderTitle()}
          {this.renderDescription()}
          {this.renderButtons()}
        </Modal>
      </Wrapper>
    )
  }
}
// ConvoseAlert.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "ConvoseAlert",
//   diffNameColor: "red",
// }
/*
How to use it as alert!
create a ref this type

private convoseAlertRef!: ConvoseAlert | null

place the component in the render

<ConvoseAlert
          ref={(ref) => {
            this.convoseAlertRef = ref
          }}
 />

 and anywhere you want to call it: 
 this.convoseAlertRef?.show({
        title: "title",
        description: "description",
        ioniconName: "ios-trash",
        buttons: [
          {
            title: "Remove",
            onPress: () => {
              this.deleteMessage(selectedMessage)
              this.dismissSelectedMessage()
            },
          },
          {
            title: "Cancel",
            type: "cancel",
            onPress: this.dismissSelectedMessage,
          },
        ],
      })

*/
