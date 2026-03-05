import React from 'react';
import { AvatarView, AvatarViewProps } from './AvatarView';

/**
 * In a production environment with Bare Workflow, this component would be implemented natively:
 * - Android: using a SimpleViewManager in Kotlin
 * - iOS: using an RCTViewManager in Swift
 */
export const NativeAvatarView: React.FC<AvatarViewProps> = (props) => {
    return <AvatarView {...props} />;
};
