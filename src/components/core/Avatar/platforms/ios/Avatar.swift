/**
 * Avatar SwiftUI Implementation
 * 
 * A visual representation component for users (Human) and AI agents (Agent)
 * with distinct shape-based differentiation:
 * - Human: Circle shape (organic, natural)
 * - Agent: Hexagon shape (synthetic, constructed)
 * 
 * Follows True Native Architecture with build-time platform separation.
 * Uses token-based styling for consistent cross-platform appearance.
 * Integrates with IconBase component for icon rendering.
 * 
 * @see .kiro/specs/042-avatar-component/design.md for implementation details
 * @see .kiro/specs/042-avatar-component/requirements.md Requirements 1.5, 2.7, 8.4, 9.3, 14.3
 * @see src/components/core/Icon-Base/platforms/ios/IconBase.ios.swift for Icon component
 */

import SwiftUI

// MARK: - Avatar Tokens

/**
 * Avatar-specific design tokens.
 * 
 * These tokens are component-level tokens specific to the Avatar component.
 * They reference or extend the core DesignTokens where possible.
 * 
 * Icon size tokens use the existing DesignTokens.iconSizeXXX values where available,
 * with component-specific gap fillers for xs and xxl sizes.
 * 
 * @see Requirements: 3.1, 3.6 - Icon sizing at 50% ratio
 * @see Requirements: 4.1, 4.2 - Background colors
 * @see Requirements: 7.1-7.4 - Border styles
 */
enum AvatarTokens {
    // MARK: - Avatar Icon Size Tokens (Gap Fillers)
    
    /// Icon size for xs avatar (12px = 1.5 × base)
    /// Component token gap filler - no existing icon token at this size
    /// @see Requirements: 3.1 - xs avatar icon size
    static let iconSizeXs: CGFloat = 12
    
    /// Icon size for xxl avatar (64px = 8 × base)
    /// Component token gap filler - no existing icon token at this size
    /// @see Requirements: 3.6 - xxl avatar icon size
    static let iconSizeXxl: CGFloat = 64
    
    // MARK: - Avatar Color Tokens
    
    /// Background color for human avatars
    /// References: color.avatar.human → orange300
    /// @see Requirements: 4.1 - Human type background color
    static let colorHuman: Color = Color(red: 1.0, green: 0.42, blue: 0.208) // #FF6B35 (orange300 light base)
    
    /// Background color for agent avatars
    /// References: color.avatar.agent → teal300
    /// @see Requirements: 4.2 - Agent type background color
    static let colorAgent: Color = Color(red: 0.024, green: 0.714, blue: 0.831) // #06B6D4 (teal300 light base)
    
    /// Icon color on human avatar background
    /// References: color.avatar.contrast.onHuman → white100
    /// @see Requirements: 6.1 - Human type icon contrast color
    static let contrastOnHuman: Color = .white
    
    /// Icon color on agent avatar background
    /// References: color.avatar.contrast.onAgent → white100
    /// @see Requirements: 6.2 - Agent type icon contrast color
    static let contrastOnAgent: Color = .white
    
    /// Border color for avatars (xs through xl sizes)
    /// References: color.avatar.border → gray100
    /// @see Requirements: 7.2 - Border color for xs-xl sizes
    static let borderColor: Color = Color(red: 0.6, green: 0.6, blue: 0.6) // gray100 approximation
    
    /// Border color for xxl size avatars
    /// References: color.contrast.onSurface
    /// @see Requirements: 7.4 - Border color for xxl size
    static let borderColorXxl: Color = .white
    
    // MARK: - Avatar Border Tokens
    
    /// Default border width (1px)
    /// References: borderDefault → borderWidth100
    /// @see Requirements: 7.1 - Border width for xs-xl sizes
    static let borderWidthDefault: CGFloat = 1
    
    /// Emphasis border width (2px)
    /// References: borderEmphasis → borderWidth200
    /// @see Requirements: 7.3 - Border width for xxl size
    static let borderWidthEmphasis: CGFloat = 2
    
    // MARK: - Avatar Opacity Tokens
    
    /// Heavy opacity for border (48%)
    /// References: opacity.heavy → opacity600 (0.48)
    /// @see Requirements: 7.2 - Border opacity for xs-xl sizes
    static let opacityHeavy: Double = 0.48
}

// MARK: - Avatar Type Enum

/**
 * Avatar entity type determines shape.
 * 
 * - human: Circle shape (organic, natural) - for representing human users
 * - agent: Hexagon shape (synthetic, constructed) - for representing AI agents
 * 
 * @see Requirements: 1.1, 1.2 - Shape-based entity differentiation
 */
public enum AvatarType: String, CaseIterable {
    case human
    case agent
}

// MARK: - Avatar Size Enum

/**
 * Avatar size variants derived from spacing token system.
 * 
 * Size values are defined by component tokens:
 * - xs: 24px (avatar.size.xs, references space300)
 * - sm: 32px (avatar.size.sm, references space400)
 * - md: 40px (avatar.size.md, references space500) - default
 * - lg: 48px (avatar.size.lg, references space600)
 * - xl: 80px (avatar.size.xl, calculated: SPACING_BASE_VALUE * 10)
 * - xxl: 128px (avatar.size.xxl, calculated: SPACING_BASE_VALUE * 16)
 * 
 * @see Requirements: 2.1-2.6 - Size variants
 */
public enum AvatarSize: String, CaseIterable {
    case xs
    case sm
    case md
    case lg
    case xl
    case xxl
    
    /// Avatar dimension in points (height)
    /// Width is calculated based on shape (circle = height, hexagon = height × 0.866)
    var dimension: CGFloat {
        switch self {
        case .xs: return 24
        case .sm: return 32
        case .md: return 40
        case .lg: return 48
        case .xl: return 80
        case .xxl: return 128
        }
    }
    
    /// Icon dimension in points (50% of avatar height)
    /// Uses DesignTokens icon size tokens where available, AvatarTokens for gap fillers (xs, xxl)
    /// @see Requirements: 3.1-3.6 - Icon sizing at 50% ratio
    /// @see design.md AVATAR_ICON_SIZE_TOKENS mapping
    var iconDimension: CGFloat {
        switch self {
        case .xs: return AvatarTokens.iconSizeXs       // 12px - component token gap filler (no existing icon token)
        case .sm: return DesignTokens.iconSize050     // 16px - references icon.size050
        case .md: return DesignTokens.iconSize075     // 20px - references icon.size075
        case .lg: return DesignTokens.iconSize100     // 24px - references icon.size100
        case .xl: return DesignTokens.iconSize500     // 40px - references icon.size500
        case .xxl: return AvatarTokens.iconSizeXxl    // 64px - component token gap filler (no existing icon token)
        }
    }
    
    /// Icon token reference for documentation and cross-platform consistency
    /// @see Requirements: 3.1-3.6 - Icon size token references
    var iconTokenReference: String {
        switch self {
        case .xs: return "avatar.icon.size.xs"
        case .sm: return "icon.size050"
        case .md: return "icon.size075"
        case .lg: return "icon.size100"
        case .xl: return "icon.size500"
        case .xxl: return "avatar.icon.size.xxl"
        }
    }
    
    /// Border width for this size
    /// Uses semantic border tokens:
    /// - xs through xl: borderDefault → borderWidth100 (1px)
    /// - xxl: borderEmphasis → borderWidth200 (2px)
    /// @see Requirements: 7.1, 7.3 - Border width per size
    var borderWidth: CGFloat {
        switch self {
        case .xxl: return AvatarTokens.borderWidthEmphasis  // 2px
        default: return AvatarTokens.borderWidthDefault     // 1px
        }
    }
}

// MARK: - Avatar Default Values

/**
 * Default values for Avatar props matching web component.
 * 
 * @see Requirements: 1.5, 2.7, 8.4, 9.3 - Default values
 */
public enum AvatarDefaults {
    /// Default entity type
    /// @see Requirements: 1.5 - Default to "human" type when prop omitted
    public static let type: AvatarType = .human
    
    /// Default size variant
    /// @see Requirements: 2.7 - Default to "md" size when prop omitted
    public static let size: AvatarSize = .md
    
    /// Default interactive state
    /// @see Requirements: 8.4 - Default interactive to false when prop omitted
    public static let interactive: Bool = false
    
    /// Default decorative state
    /// @see Requirements: 9.3 - Default decorative to false when prop omitted
    public static let decorative: Bool = false
}

// MARK: - Avatar View

/**
 * Avatar SwiftUI View
 * 
 * A visual representation component for users (Human) and AI agents (Agent)
 * with distinct shape-based differentiation.
 * 
 * Usage:
 * ```swift
 * // Basic human avatar
 * Avatar(type: .human, size: .md)
 * 
 * // Agent avatar
 * Avatar(type: .agent, size: .lg)
 * 
 * // Human avatar with image
 * Avatar(type: .human, size: .xl, src: URL(string: "https://example.com/photo.jpg"), alt: "User profile")
 * 
 * // Interactive avatar (shows hover visual feedback)
 * Avatar(type: .human, size: .md, interactive: true)
 * 
 * // Decorative avatar (hidden from VoiceOver)
 * Avatar(type: .human, size: .sm, decorative: true)
 * ```
 * 
 * @see Requirements: 1.5, 2.7, 8.4, 9.3, 14.3 in .kiro/specs/042-avatar-component/requirements.md
 */
public struct Avatar: View {
    
    // MARK: - Properties
    
    /// Entity type determines shape: 'human' = circle, 'agent' = hexagon
    /// @see Requirements: 1.1, 1.2, 1.5 - Type determines shape, defaults to human
    public let type: AvatarType
    
    /// Avatar size variant
    /// @see Requirements: 2.1-2.7 - Size variants with default md
    public let size: AvatarSize
    
    /// Image source URL (human only, ignored for agent type)
    /// @see Requirements: 5.1, 5.5 - Image support for human type only
    public var src: URL?
    
    /// Alt text for accessibility (required if src provided)
    /// @see Requirements: 5.4, 9.1 - Alt text for screen reader announcement
    public var alt: String?
    
    /// Whether avatar shows hover visual feedback
    /// @see Requirements: 8.1-8.4 - Interactive hover state
    public var interactive: Bool
    
    /// Hide from screen readers (use when avatar is decorative)
    /// @see Requirements: 9.2, 9.3 - Decorative mode with aria-hidden
    public var decorative: Bool
    
    /// Test ID for automated testing
    /// @see Requirements: 16.1, 16.2 - testID as accessibilityIdentifier
    public var testID: String?
    
    // MARK: - State
    
    /// Tracks hover state for interactive avatars
    @State private var isHovered: Bool = false
    
    /// Tracks whether image failed to load (for fallback to icon)
    @State private var imageLoadFailed: Bool = false
    
    // MARK: - Initialization
    
    /**
     * Initialize Avatar with all properties.
     * 
     * - Parameters:
     *   - type: Entity type ('human' = circle, 'agent' = hexagon). Defaults to .human
     *   - size: Size variant. Defaults to .md
     *   - src: Image source URL (human only). Defaults to nil
     *   - alt: Alt text for accessibility. Defaults to nil
     *   - interactive: Whether to show hover visual feedback. Defaults to false
     *   - decorative: Hide from screen readers. Defaults to false
     *   - testID: Test ID for automated testing. Defaults to nil
     * 
     * @see Requirements: 1.5, 2.7, 8.4, 9.3 - Default values matching web component
     */
    public init(
        type: AvatarType = AvatarDefaults.type,
        size: AvatarSize = AvatarDefaults.size,
        src: URL? = nil,
        alt: String? = nil,
        interactive: Bool = AvatarDefaults.interactive,
        decorative: Bool = AvatarDefaults.decorative,
        testID: String? = nil
    ) {
        self.type = type
        self.size = size
        self.src = src
        self.alt = alt
        self.interactive = interactive
        self.decorative = decorative
        self.testID = testID
    }
    
    // MARK: - Body
    
    /**
     * Main body with accessibility modifiers.
     * 
     * Accessibility features:
     * - `.accessibilityHidden(decorative)`: Hides from VoiceOver when decorative is true
     * - `.accessibilityIdentifier(testID)`: Sets test identifier for automated testing
     * - `.accessibilityLabel(alt)`: Announces alt text for images to VoiceOver
     * 
     * @see Requirements: 9.1, 9.2, 9.3, 16.1, 16.2 - Accessibility implementation
     */
    public var body: some View {
        avatarContainer
            .accessibilityHidden(decorative)
            .accessibilityIdentifier(testID ?? "")
            .accessibilityLabel(accessibilityLabelText)
            .accessibilityAddTraits(accessibilityTraits)
    }
    
    // MARK: - Avatar Container
    
    /**
     * Main avatar container with shape, content, and border.
     * 
     * Structure:
     * - ZStack containing background, content, and border overlay
     * - Shape determined by type (Circle for human, RoundedPointyTopHexagon for agent)
     * - Size determined by size prop
     * - Border applied via overlay
     * 
     * @see Requirements: 1.1, 1.2, 2.1-2.6, 7.1-7.4
     */
    @ViewBuilder
    private var avatarContainer: some View {
        applyClipShape(
            to: ZStack {
                // Background color (hidden when showing image)
                backgroundColor
                    .opacity(shouldShowImage ? 0 : 1)
                
                // Content (image or icon)
                avatarContent
            }
            .frame(width: avatarWidth, height: size.dimension)
        )
        .overlay(borderOverlay)
        .onHover { hovering in
            if interactive {
                isHovered = hovering
            }
        }
    }
    
    // MARK: - Shape
    
    /**
     * Applies the correct clip shape based on avatar type.
     * 
     * - Human: Circle (border-radius: 50%)
     * - Agent: RoundedPointyTopHexagon (custom shape)
     * 
     * Uses conditional application since SwiftUI's `some Shape` cannot be used
     * with different concrete Shape types in a single computed property.
     * 
     * @see Requirements: 1.1, 1.2, 12.1-12.3
     */
    @ViewBuilder
    private func applyClipShape<Content: View>(to content: Content) -> some View {
        if type == .human {
            content.clipShape(Circle())
        } else {
            content.clipShape(RoundedPointyTopHexagon())
        }
    }
    
    /**
     * Avatar width based on type.
     * 
     * - Human (circle): width = height
     * - Agent (hexagon): width = height × cos(30°) ≈ height × 0.866
     * 
     * @see Requirements: 1.3 - Hexagon aspect ratio
     */
    private var avatarWidth: CGFloat {
        switch type {
        case .human:
            return size.dimension
        case .agent:
            return size.dimension * RoundedPointyTopHexagon.aspectRatio
        }
    }
    
    // MARK: - Content
    
    /**
     * Avatar content using @ViewBuilder for conditional rendering.
     * 
     * Content priority:
     * 1. For agent type: Always render icon (src prop is ignored)
     * 2. For human type with src (and not failed): Render image
     * 3. For human type without src (or failed): Render icon placeholder
     * 
     * @see Requirements: 5.1, 5.5, 5.6 - Content rendering logic
     */
    @ViewBuilder
    private var avatarContent: some View {
        if shouldShowImage, let imageURL = src {
            // Human type with valid image URL
            imageContent(url: imageURL)
        } else {
            // Icon placeholder (human without image, or agent)
            iconContent
        }
    }
    
    /**
     * Determine if image should be shown.
     * 
     * Image is shown when:
     * - Type is human (agent ignores src)
     * - src URL is provided
     * - Image has not failed to load
     * 
     * @see Requirements: 5.1, 5.5, 5.6
     */
    private var shouldShowImage: Bool {
        type == .human && src != nil && !imageLoadFailed
    }
    
    /**
     * Image content for human avatars.
     * 
     * Uses AsyncImage for async loading with fallback to icon on failure.
     * 
     * @see Requirements: 5.1, 5.2, 5.3, 5.6
     */
    @ViewBuilder
    private func imageContent(url: URL) -> some View {
        AsyncImage(url: url) { phase in
            switch phase {
            case .success(let image):
                image
                    .resizable()
                    .scaledToFill()
            case .failure:
                // Fallback to icon on load failure
                // @see Requirements: 5.6 - Fall back to icon placeholder
                iconContent
                    .onAppear {
                        imageLoadFailed = true
                    }
            case .empty:
                // Loading state - show placeholder
                iconContent
            @unknown default:
                iconContent
            }
        }
    }
    
    /**
     * Icon content for avatar placeholder.
     * 
     * Integrates with IconBase component for consistent icon rendering across the design system.
     * Uses token-based sizing for cross-platform consistency.
     * 
     * - Human: "user" icon (person silhouette)
     * - Agent: "sparkles" icon (AI/bot placeholder)
     * 
     * @see Requirements: 3.7, 3.8, 6.1, 6.2, 15.3 - Icon integration
     * @see src/components/core/Icon-Base/platforms/ios/IconBase.ios.swift
     */
    @ViewBuilder
    private var iconContent: some View {
        IconBase(
            name: iconName,
            size: size.iconDimension,
            color: iconColor
        )
    }
    
    /**
     * Icon name based on avatar type.
     * 
     * Uses Asset Catalog icon names for IconBase component.
     * - Human: "user" (person silhouette from Feather icons)
     * - Agent: "sparkles" (AI/bot placeholder)
     * 
     * @see Requirements: 3.7, 3.8
     */
    private var iconName: String {
        switch type {
        case .human: return "user"
        case .agent: return "sparkles"
        }
    }
    
    // MARK: - Colors
    
    /**
     * Background color based on avatar type.
     * 
     * Uses semantic color tokens for avatar backgrounds:
     * - Human: color.avatar.human → orange300 (#FF6B35)
     * - Agent: color.avatar.agent → teal300 (#06B6D4)
     * 
     * @see Requirements: 4.1, 4.2 - Background colors per type
     */
    private var backgroundColor: Color {
        switch type {
        case .human: return AvatarTokens.colorHuman
        case .agent: return AvatarTokens.colorAgent
        }
    }
    
    /**
     * Icon color based on avatar type.
     * 
     * Uses semantic color tokens for icon contrast:
     * - Human: color.avatar.contrast.onHuman → white100
     * - Agent: color.avatar.contrast.onAgent → white100
     * 
     * Note: Both currently white, separate tokens for future flexibility.
     * The IconBase component accepts color parameter for tinting.
     * 
     * @see Requirements: 6.1, 6.2 - Icon contrast colors
     */
    private var iconColor: Color {
        switch type {
        case .human: return AvatarTokens.contrastOnHuman
        case .agent: return AvatarTokens.contrastOnAgent
        }
    }
    
    /// Icon color token reference for documentation
    /// @see Requirements: 6.1, 6.2
    private var iconColorTokenReference: String {
        switch type {
        case .human: return "color.avatar.contrast.onHuman"
        case .agent: return "color.avatar.contrast.onAgent"
        }
    }
    
    /**
     * Border color based on avatar size.
     * 
     * Uses semantic color tokens with appropriate opacity:
     * - xs through xl: color.avatar.border → gray100 with opacity.heavy (48%)
     * - xxl: color.contrast.onSurface (white) with full opacity
     * 
     * @see Requirements: 7.2, 7.4 - Border color per size
     */
    private var borderColor: Color {
        switch size {
        case .xxl:
            return AvatarTokens.borderColorXxl
        default:
            return AvatarTokens.borderColor.opacity(AvatarTokens.opacityHeavy)
        }
    }
    
    // MARK: - Border
    
    /**
     * Border overlay for avatar.
     * 
     * Border width changes on hover for interactive avatars:
     * - Default: borderDefault (1px) or borderEmphasis (2px) for xxl
     * - Hover (interactive): borderEmphasis (2px)
     * 
     * @see Requirements: 7.1-7.4, 8.1-8.3
     */
    @ViewBuilder
    private var borderOverlay: some View {
        if type == .human {
            Circle()
                .stroke(borderColor, lineWidth: currentBorderWidth)
        } else {
            RoundedPointyTopHexagon()
                .stroke(borderColor, lineWidth: currentBorderWidth)
        }
    }
    
    /**
     * Current border width based on size and hover state.
     * 
     * Uses semantic border tokens:
     * - Default: borderDefault (1px) or borderEmphasis (2px) for xxl
     * - Hover (interactive): borderEmphasis (2px)
     * 
     * @see Requirements: 7.1, 7.3, 8.1 - Border width per size and hover state
     */
    private var currentBorderWidth: CGFloat {
        if interactive && isHovered {
            return AvatarTokens.borderWidthEmphasis  // 2px on hover
        }
        return size.borderWidth
    }
    
    // MARK: - Accessibility
    
    /**
     * Accessibility label text for VoiceOver announcement.
     * 
     * Priority:
     * 1. If alt text is provided (for images), use alt text
     * 2. Otherwise, use a descriptive label based on avatar type
     * 
     * When decorative is true, this label is ignored because
     * `.accessibilityHidden(true)` hides the element from VoiceOver.
     * 
     * @see Requirements: 9.1 - Alt text announced by screen readers
     * @see Requirements: 5.4 - Alt prop for image accessibility
     */
    private var accessibilityLabelText: String {
        // If alt text is provided (typically for images), use it
        if let altText = alt, !altText.isEmpty {
            return altText
        }
        
        // Default descriptive label based on type
        switch type {
        case .human:
            return "User avatar"
        case .agent:
            return "AI agent avatar"
        }
    }
    
    /**
     * Accessibility traits for the avatar.
     * 
     * Avatar is an image element, so it should have the `.isImage` trait.
     * This helps VoiceOver users understand the nature of the element.
     * 
     * @see Requirements: 9.1 - Screen reader support
     */
    private var accessibilityTraits: AccessibilityTraits {
        .isImage
    }
}

// MARK: - Preview

/**
 * SwiftUI Preview for Avatar component.
 * 
 * Demonstrates all type/size combinations, image examples, and interactive states.
 * Shows IconBase integration with token-based sizing.
 * 
 * @see Requirements: 14.1, 14.2, 14.3 - Cross-platform consistency verification
 */
struct Avatar_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Avatar Component")
                    .font(.headline)
                
                // Human avatars - all sizes with IconBase integration
                Text("Human Avatars (Circle) - IconBase Integration")
                    .font(.subheadline)
                
                HStack(spacing: 16) {
                    ForEach(AvatarSize.allCases, id: \.self) { size in
                        VStack {
                            Avatar(type: .human, size: size)
                            Text(size.rawValue)
                                .font(.caption)
                            Text("\(Int(size.iconDimension))pt icon")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                    }
                }
                
                Divider()
                
                // Agent avatars - all sizes with IconBase integration
                Text("Agent Avatars (Hexagon) - IconBase Integration")
                    .font(.subheadline)
                
                HStack(spacing: 16) {
                    ForEach(AvatarSize.allCases, id: \.self) { size in
                        VStack {
                            Avatar(type: .agent, size: size)
                            Text(size.rawValue)
                                .font(.caption)
                            Text("\(Int(size.iconDimension))pt icon")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                    }
                }
                
                Divider()
                
                // Icon token references
                Text("Icon Token References")
                    .font(.subheadline)
                
                VStack(alignment: .leading, spacing: 8) {
                    ForEach(AvatarSize.allCases, id: \.self) { size in
                        HStack {
                            Avatar(type: .human, size: size)
                            Text("\(size.rawValue): \(size.iconTokenReference)")
                                .font(.caption)
                        }
                    }
                }
                
                Divider()
                
                // Interactive examples
                Text("Interactive Avatars")
                    .font(.subheadline)
                
                HStack(spacing: 24) {
                    VStack {
                        Avatar(type: .human, size: .lg, interactive: true)
                        Text("Human")
                            .font(.caption)
                    }
                    
                    VStack {
                        Avatar(type: .agent, size: .lg, interactive: true)
                        Text("Agent")
                            .font(.caption)
                    }
                }
                
                Divider()
                
                // Decorative example
                Text("Decorative Avatar (Hidden from VoiceOver)")
                    .font(.subheadline)
                
                HStack {
                    Avatar(type: .human, size: .md, decorative: true)
                    Text("John Doe")
                }
                
                Divider()
                
                // Accessibility examples
                Text("Accessibility Examples")
                    .font(.subheadline)
                
                VStack(alignment: .leading, spacing: 12) {
                    // Avatar with alt text (VoiceOver announces "Profile photo of Jane")
                    HStack {
                        Avatar(
                            type: .human,
                            size: .md,
                            src: URL(string: "https://example.com/jane.jpg"),
                            alt: "Profile photo of Jane"
                        )
                        Text("With alt text")
                            .font(.caption)
                    }
                    
                    // Avatar without alt text (VoiceOver announces "User avatar")
                    HStack {
                        Avatar(type: .human, size: .md)
                        Text("Default label: 'User avatar'")
                            .font(.caption)
                    }
                    
                    // Agent avatar (VoiceOver announces "AI agent avatar")
                    HStack {
                        Avatar(type: .agent, size: .md)
                        Text("Default label: 'AI agent avatar'")
                            .font(.caption)
                    }
                }
                
                Divider()
                
                // With testID
                Text("Avatar with testID")
                    .font(.subheadline)
                
                Avatar(type: .human, size: .md, testID: "user-avatar")
            }
            .padding()
        }
    }
}
