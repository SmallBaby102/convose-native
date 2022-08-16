import React from "react"
import { Animated, Easing, ViewStyle } from "react-native"
import _ from "lodash"

type Props = {
  isVisible: boolean
  animationOnProperty: string
  outputRange: string[] | number[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch?: any
  dontMountUnmountChildren?: boolean
  hideAnimationDuration?: number
  showAnimationDuration?: number
  hideAnimationEasing?: (value: number) => number
  showAnimationEasing?: (value: number) => number
  viewStyles?: ViewStyle
}
type State = {
  view: React.ReactNode | null
  animation: Animated.Value
}
export class AnimatedHideAndShowComponent extends React.Component<
  Props,
  State
> {
  public readonly state = {
    // eslint-disable-next-line react/destructuring-assignment
    view: this.props.children,
    // eslint-disable-next-line react/destructuring-assignment
    animation: new Animated.Value(this.props.isVisible ? 1 : 0),
  }

  public shouldComponentUpdate(prevProps: Props, prevState: State): boolean {
    return (
      !_.isEqual(this.props, prevProps) || !_.isEqual(this.state, prevState)
    )
  }

  public componentDidUpdate(prevProps: Props): void {
    const { isVisible, watch } = this.props
    const { view } = this.state
    const prevIsVisible = prevProps.isVisible
    if (prevIsVisible && !isVisible) {
      this.hideComponent()
    }
    if (!prevIsVisible && isVisible) {
      this.showComponent()
    }
    if (prevProps.watch !== watch && !!view && isVisible) {
      this.insertView()
    }
  }

  public hideComponent = (): void => {
    const { animation } = this.state
    const { hideAnimationDuration, hideAnimationEasing } = this.props
    Animated.timing(animation, {
      toValue: 0,
      delay: 0,
      easing: hideAnimationEasing || Easing.inOut(Easing.ease),
      duration: hideAnimationDuration || 200,
      useNativeDriver: false,
    }).start(this.removeView)
  }

  public showComponent = (): void => {
    const { animation } = this.state
    const { showAnimationDuration, showAnimationEasing } = this.props
    this.insertView()
    Animated.timing(animation, {
      toValue: 1,
      delay: 0,
      easing: showAnimationEasing || Easing.bezier(0.01, 0.31, 0, -0.02),
      duration: showAnimationDuration || 150,
      useNativeDriver: false,
    }).start()
  }

  public insertView = (): void => {
    const { children, dontMountUnmountChildren } = this.props
    if (dontMountUnmountChildren) {
      return
    }
    this.setState({
      view: children,
    })
  }

  public removeView = (): void => {
    const { dontMountUnmountChildren } = this.props
    if (dontMountUnmountChildren) {
      return
    }
    this.setState({
      view: null,
    })
  }

  public render(): React.ReactNode {
    const { view, animation } = this.state
    const {
      animationOnProperty,
      outputRange,
      dontMountUnmountChildren,
      children,
      viewStyles,
    } = this.props
    const propertyAnimation = animation.interpolate({
      inputRange: [0, 1],
      outputRange,
    })
    const viewToRender = dontMountUnmountChildren ? children : view
    return (
      <Animated.View
        // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop
        style={[
          viewStyles,
          {
            [animationOnProperty]: propertyAnimation,
          },
        ]}
      >
        {viewToRender}
      </Animated.View>
    )
  }
}
// AnimatedHideAndShowComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "AnimatedHideAndShowComponent",
//   diffNameColor: "red",
// }
