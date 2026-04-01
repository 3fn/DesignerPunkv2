/**
 * Nav-Header-App — iOS Implementation
 * Thin wrapper composing NavHeaderBase with permissive slots.
 * @module Nav-Header-App/platforms/ios
 */

import SwiftUI

struct NavHeaderApp<Leading: View, Center: View, Trailing: View>: View {
    let leadingContent: Leading
    let centerContent: Center
    let trailingContent: Trailing
    var appearance: NavHeaderAppearance = .opaque
    var showSeparator: Bool = true
    var testID: String? = nil

    var body: some View {
        NavHeaderBase(
            leadingSlot: leadingContent,
            titleSlot: centerContent,
            trailingSlot: trailingContent,
            appearance: appearance,
            showSeparator: showSeparator,
            testID: testID
        )
    }
}
