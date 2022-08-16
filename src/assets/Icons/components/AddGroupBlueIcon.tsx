import React from "react"
import BaseIcon, { SvgProps } from "./BaseIcon"

const xml = `<svg width="36" height="29" viewBox="0 0 36 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.3141 6.94509C19.3141 8.85369 18.6106 10.5058 17.2229 11.8562C15.8351 13.2064 14.1369 13.8908 12.1753 13.8908H12.1719C10.2127 13.8902 8.51564 13.2057 7.1279 11.8562C5.73993 10.5058 5.03668 8.85369 5.03668 6.94509C5.03668 5.03716 5.73993 3.38487 7.1279 2.03466C8.51496 0.684895 10.212 0.000660037 12.1719 0H12.1753C14.1362 0 15.8344 0.684455 17.2229 2.03466C18.6106 3.38487 19.3141 5.03716 19.3141 6.94509Z" fill="#33BBEE"/>
<path d="M24.7281 23.8781C24.7281 25.3838 24.2358 26.6029 23.2661 27.5008C22.3078 28.3881 21.0404 28.8376 19.4993 28.8376H5.22804C3.68699 28.8376 2.41955 28.3881 1.46191 27.5008C0.491599 26.6023 0 25.3834 0 23.8781C0 23.299 0.019673 22.7261 0.059019 22.1752C0.0990434 21.612 0.179997 20.999 0.299391 20.3524C0.419691 19.7005 0.574361 19.0843 0.759559 18.521C0.951766 17.938 1.21181 17.3629 1.53359 16.812C1.8678 16.2402 2.26036 15.7421 2.7004 15.332C3.1617 14.9027 3.72566 14.558 4.37758 14.3067C5.02724 14.0568 5.74745 13.9301 6.51809 13.9301C6.82042 13.9301 7.11326 14.0504 7.67767 14.4081C8.03088 14.6323 8.43791 14.8875 8.88722 15.167C9.27525 15.4076 9.80077 15.6334 10.4504 15.8373C11.0214 16.0171 11.601 16.1174 12.1735 16.1348C12.2366 16.137 12.2997 16.1381 12.3628 16.1381C12.9986 16.1381 13.6418 16.0367 14.2758 15.8373C14.9255 15.6334 15.4517 15.4076 15.8395 15.167C16.2935 14.8847 16.7006 14.6297 17.0486 14.4088C17.6134 14.0504 17.9058 13.9301 18.2088 13.9301C18.9788 13.9301 19.699 14.0568 20.3491 14.3067C21.001 14.558 21.565 14.9034 22.0258 15.332C22.4666 15.7421 22.8591 16.2402 23.1931 16.812C23.5151 17.3633 23.7756 17.938 23.9671 18.5204C24.1526 19.0843 24.3077 19.7005 24.428 20.3528C24.5467 21.0001 24.6279 21.6131 24.6677 22.1748C24.7077 22.7239 24.7274 23.2968 24.7281 23.8781Z" fill="#33BBEE"/>
<path d="M33.9565 8.8111H29.9828V4.83749C29.9828 4.15108 29.4258 3.59407 28.7394 3.59407C28.0529 3.59407 27.4961 4.15123 27.4961 4.83759V8.8112H23.5224C22.836 8.8112 22.2789 9.36821 22.2789 10.0546C22.2789 10.741 22.836 11.298 23.5224 11.298H27.4961V15.2716C27.4961 15.9581 28.0531 16.5151 28.7395 16.5151C29.4259 16.5151 29.9829 15.9581 29.9829 15.2716V11.298H33.9565C34.6429 11.298 35.2 10.741 35.2 10.0546C35.2 9.36823 34.643 8.8111 33.9565 8.8111Z" fill="#33BBEE" stroke="#33BBEE" stroke-width="0.4"/>
</svg>`

const AddGroupBlueIcon = (props: SvgProps) => (
  <BaseIcon width={props.width} height={props.height} xml={xml} />
)

export default AddGroupBlueIcon