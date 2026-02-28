/**
 * Avatar SwiftUI Preview
 * 
 * Comprehensive preview demonstrating all Avatar component configurations.
 * Used for visual verification and cross-platform consistency testing.
 * 
 * Preview Sections:
 * 1. All Type/Size Combinations - Grid showing human and agent avatars at all sizes
 * 2. Image Examples - Human avatars with profile images
 * 3. Interactive Examples - Avatars with hover visual feedback
 * 4. Accessibility Examples - Decorative mode and alt text usage
 * 5. Cross-Platform Consistency - Token reference documentation
 * 
 * @see .kiro/specs/042-avatar-component/requirements.md Requirements 14.1, 14.2, 14.3
 * @see .kiro/specs/042-avatar-component/design.md for implementation details
 */

import SwiftUI

// MARK: - Avatar Preview Provider

/**
 * Main preview provider for Avatar component.
 * 
 * Demonstrates all type/size combinations, image examples, and interactive states.
 * Verifies visual consistency with web implementation through token-based sizing.
 * 
 * @see Requirements: 14.1, 14.2, 14.3 - Cross-platform consistency verification
 */
struct AvatarPreview_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 32) {
                // Header
                headerSection
                
                Divider()
                
                // Section 1: All Type/Size Combinations
                allTypeSizeCombinationsSection
                
                Divider()
                
                // Section 2: Image Examples
                imageExamplesSection
                
                Divider()
                
                // Section 3: Interactive Examples
                interactiveExamplesSection
                
                Divider()
                
                // Section 4: Accessibility Examples
                accessibilityExamplesSection
                
                Divider()
                
                // Section 5: Cross-Platform Consistency
                crossPlatformConsistencySection
                
                Divider()
                
                // Section 6: Border Styles
                borderStylesSection
            }
            .padding()
        }
        .previewDisplayName("Avatar Component Preview")
    }
    
    // MARK: - Header Section
    
    private static var headerSection: some View {
        VStack(spacing: 8) {
            Text("Avatar Component")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            Text("Visual representation for users (Human) and AI agents (Agent)")
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            Text("Human = Circle | Agent = Hexagon")
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
    
    // MARK: - Section 1: All Type/Size Combinations
    
    private static var allTypeSizeCombinationsSection: some View {
        VStack(spacing: 24) {
            Text("1. All Type/Size Combinations")
                .font(.headline)
            
            // Human avatars - all sizes
            VStack(spacing: 12) {
                Text("Human Avatars (Circle)")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                HStack(alignment: .bottom, spacing: 16) {
                    ForEach(AvatarSize.allCases, id: \.self) { size in
                        VStack(spacing: 4) {
                            Avatar(type: .human, size: size)
                            Text(size.rawValue)
                                .font(.caption2)
                            Text("\(Int(size.dimension))pt")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                    }
                }
            }
            
            // Agent avatars - all sizes
            VStack(spacing: 12) {
                Text("Agent Avatars (Hexagon)")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                HStack(alignment: .bottom, spacing: 16) {
                    ForEach(AvatarSize.allCases, id: \.self) { size in
                        VStack(spacing: 4) {
                            Avatar(type: .agent, size: size)
                            Text(size.rawValue)
                                .font(.caption2)
                            Text("\(Int(size.dimension))pt")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                    }
                }
            }
            
            // Side-by-side comparison
            VStack(spacing: 12) {
                Text("Side-by-Side Comparison")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                HStack(spacing: 24) {
                    ForEach([AvatarSize.sm, .md, .lg, .xl], id: \.self) { size in
                        VStack(spacing: 8) {
                            HStack(spacing: 8) {
                                Avatar(type: .human, size: size)
                                Avatar(type: .agent, size: size)
                            }
                            Text(size.rawValue)
                                .font(.caption2)
                        }
                    }
                }
            }
        }
    }
    
    // MARK: - Section 2: Image Examples
    
    private static var imageExamplesSection: some View {
        VStack(spacing: 24) {
            Text("2. Image Examples (Human Only)")
                .font(.headline)
            
            Text("Agent avatars ignore src prop - always show icon")
                .font(.caption)
                .foregroundColor(.secondary)
            
            // Human avatars with images
            VStack(spacing: 12) {
                Text("Human with Profile Image")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                HStack(spacing: 24) {
                    // Small image avatar
                    VStack(spacing: 4) {
                        Avatar(
                            type: .human,
                            size: .md,
                            src: URL(string: "https://i.pravatar.cc/80?img=1"),
                            alt: "Profile photo of Alex"
                        )
                        Text("md")
                            .font(.caption2)
                    }
                    
                    // Large image avatar
                    VStack(spacing: 4) {
                        Avatar(
                            type: .human,
                            size: .xl,
                            src: URL(string: "https://i.pravatar.cc/160?img=2"),
                            alt: "Profile photo of Jordan"
                        )
                        Text("xl")
                            .font(.caption2)
                    }
                    
                    // XXL image avatar
                    VStack(spacing: 4) {
                        Avatar(
                            type: .human,
                            size: .xxl,
                            src: URL(string: "https://i.pravatar.cc/256?img=3"),
                            alt: "Profile photo of Sam"
                        )
                        Text("xxl")
                            .font(.caption2)
                    }
                }
            }
            
            // Agent ignores src
            VStack(spacing: 12) {
                Text("Agent Ignores src Prop")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                HStack(spacing: 24) {
                    VStack(spacing: 4) {
                        // Agent with src (should show icon, not image)
                        Avatar(
                            type: .agent,
                            size: .lg,
                            src: URL(string: "https://i.pravatar.cc/96?img=4"),
                            alt: "This alt text is ignored"
                        )
                        Text("src ignored")
                            .font(.caption2)
                            .foregroundColor(.orange)
                    }
                    
                    VStack(spacing: 4) {
                        // Agent without src (same appearance)
                        Avatar(type: .agent, size: .lg)
                        Text("no src")
                            .font(.caption2)
                    }
                }
            }
            
            // Image fallback (simulated - actual fallback requires network failure)
            VStack(spacing: 12) {
                Text("Image Fallback to Icon")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                Text("When image fails to load, falls back to icon placeholder")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                HStack(spacing: 24) {
                    VStack(spacing: 4) {
                        // Invalid URL - will show fallback
                        Avatar(
                            type: .human,
                            size: .lg,
                            src: URL(string: "https://invalid-url-that-will-fail.com/image.jpg"),
                            alt: "Fallback example"
                        )
                        Text("Invalid URL")
                            .font(.caption2)
                    }
                    
                    VStack(spacing: 4) {
                        // No src - shows icon
                        Avatar(type: .human, size: .lg)
                        Text("No src")
                            .font(.caption2)
                    }
                }
            }
        }
    }
    
    // MARK: - Section 3: Interactive Examples
    
    private static var interactiveExamplesSection: some View {
        VStack(spacing: 24) {
            Text("3. Interactive Examples")
                .font(.headline)
            
            Text("Hover over avatars to see border width increase")
                .font(.caption)
                .foregroundColor(.secondary)
            
            // Interactive avatars
            VStack(spacing: 12) {
                Text("Interactive Avatars (hover to see effect)")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                HStack(spacing: 32) {
                    VStack(spacing: 8) {
                        Avatar(type: .human, size: .lg, interactive: true)
                        Text("Human")
                            .font(.caption)
                        Text("interactive: true")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                    
                    VStack(spacing: 8) {
                        Avatar(type: .agent, size: .lg, interactive: true)
                        Text("Agent")
                            .font(.caption)
                        Text("interactive: true")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }
            }
            
            // Non-interactive comparison
            VStack(spacing: 12) {
                Text("Non-Interactive (default)")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                HStack(spacing: 32) {
                    VStack(spacing: 8) {
                        Avatar(type: .human, size: .lg, interactive: false)
                        Text("Human")
                            .font(.caption)
                        Text("interactive: false")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                    
                    VStack(spacing: 8) {
                        Avatar(type: .agent, size: .lg, interactive: false)
                        Text("Agent")
                            .font(.caption)
                        Text("interactive: false")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }
            }
            
            // Interactive with image
            VStack(spacing: 12) {
                Text("Interactive with Image")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                Avatar(
                    type: .human,
                    size: .xl,
                    src: URL(string: "https://i.pravatar.cc/160?img=5"),
                    alt: "Profile photo",
                    interactive: true
                )
            }
        }
    }
    
    // MARK: - Section 4: Accessibility Examples
    
    private static var accessibilityExamplesSection: some View {
        VStack(spacing: 24) {
            Text("4. Accessibility Examples")
                .font(.headline)
            
            // Decorative mode
            VStack(spacing: 12) {
                Text("Decorative Mode (Hidden from VoiceOver)")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                Text("Use when avatar is adjacent to name text")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                HStack(spacing: 8) {
                    Avatar(type: .human, size: .md, decorative: true)
                    Text("John Doe")
                        .font(.body)
                }
                .padding()
                .background(Color.gray.opacity(0.1))
                .cornerRadius(8)
                
                Text("decorative: true → aria-hidden=\"true\"")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            
            // Alt text examples
            VStack(spacing: 12) {
                Text("Alt Text for Images")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                VStack(alignment: .leading, spacing: 8) {
                    HStack(spacing: 8) {
                        Avatar(
                            type: .human,
                            size: .md,
                            src: URL(string: "https://i.pravatar.cc/80?img=6"),
                            alt: "Profile photo of Jane Smith"
                        )
                        VStack(alignment: .leading) {
                            Text("With alt text")
                                .font(.caption)
                            Text("VoiceOver: \"Profile photo of Jane Smith\"")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                    }
                    
                    HStack(spacing: 8) {
                        Avatar(type: .human, size: .md)
                        VStack(alignment: .leading) {
                            Text("Without alt text")
                                .font(.caption)
                            Text("VoiceOver: \"User avatar\"")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                    }
                    
                    HStack(spacing: 8) {
                        Avatar(type: .agent, size: .md)
                        VStack(alignment: .leading) {
                            Text("Agent type")
                                .font(.caption)
                            Text("VoiceOver: \"AI agent avatar\"")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                    }
                }
            }
            
            // testID example
            VStack(spacing: 12) {
                Text("Test ID for Automation")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                Avatar(type: .human, size: .md, testID: "user-profile-avatar")
                
                Text("testID: \"user-profile-avatar\"")
                    .font(.caption2)
                    .foregroundColor(.secondary)
                
                Text("→ accessibilityIdentifier(\"user-profile-avatar\")")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
        }
    }
    
    // MARK: - Section 5: Cross-Platform Consistency
    
    private static var crossPlatformConsistencySection: some View {
        VStack(spacing: 24) {
            Text("5. Cross-Platform Consistency")
                .font(.headline)
            
            Text("Token references ensure identical values across Web, iOS, Android")
                .font(.caption)
                .foregroundColor(.secondary)
            
            // Size token references
            VStack(spacing: 12) {
                Text("Avatar Size Tokens")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                VStack(alignment: .leading, spacing: 8) {
                    ForEach(AvatarSize.allCases, id: \.self) { size in
                        HStack(spacing: 12) {
                            Avatar(type: .human, size: size)
                            VStack(alignment: .leading, spacing: 2) {
                                Text("avatar.size.\(size.rawValue)")
                                    .font(.caption)
                                    .fontDesign(.monospaced)
                                Text("\(Int(size.dimension))pt")
                                    .font(.caption2)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                }
            }
            
            // Icon size token references
            VStack(spacing: 12) {
                Text("Icon Size Tokens (50% ratio)")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                VStack(alignment: .leading, spacing: 8) {
                    ForEach(AvatarSize.allCases, id: \.self) { size in
                        HStack(spacing: 12) {
                            Avatar(type: .human, size: size)
                            VStack(alignment: .leading, spacing: 2) {
                                Text(size.iconTokenReference)
                                    .font(.caption)
                                    .fontDesign(.monospaced)
                                Text("\(Int(size.iconDimension))pt icon")
                                    .font(.caption2)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                }
            }
            
            // Color token references
            VStack(spacing: 12) {
                Text("Color Tokens")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                VStack(alignment: .leading, spacing: 8) {
                    HStack(spacing: 12) {
                        Avatar(type: .human, size: .md)
                        VStack(alignment: .leading, spacing: 2) {
                            Text("color.avatar.human.background")
                                .font(.caption)
                                .fontDesign(.monospaced)
                            Text("→ color.identity.human → orange300")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                    }
                    
                    HStack(spacing: 12) {
                        Avatar(type: .agent, size: .md)
                        VStack(alignment: .leading, spacing: 2) {
                            Text("color.avatar.agent.background")
                                .font(.caption)
                                .fontDesign(.monospaced)
                            Text("→ color.identity.agent → teal200")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                    }
                }
            }
        }
    }
    
    // MARK: - Section 6: Border Styles
    
    private static var borderStylesSection: some View {
        VStack(spacing: 24) {
            Text("6. Border Styles")
                .font(.headline)
            
            Text("Border width and color vary by size")
                .font(.caption)
                .foregroundColor(.secondary)
            
            // xs through xl: borderDefault (1px) with opacity
            VStack(spacing: 12) {
                Text("xs-xl: borderDefault (1px) + opacity.heavy (48%)")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                HStack(spacing: 16) {
                    ForEach([AvatarSize.xs, .sm, .md, .lg, .xl], id: \.self) { size in
                        VStack(spacing: 4) {
                            Avatar(type: .human, size: size)
                            Text(size.rawValue)
                                .font(.caption2)
                        }
                    }
                }
            }
            
            // xxl: borderEmphasis (2px) with full opacity
            VStack(spacing: 12) {
                Text("xxl: borderEmphasis (2px) + full opacity")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                HStack(spacing: 24) {
                    VStack(spacing: 4) {
                        Avatar(type: .human, size: .xxl)
                        Text("Human xxl")
                            .font(.caption2)
                    }
                    
                    VStack(spacing: 4) {
                        Avatar(type: .agent, size: .xxl)
                        Text("Agent xxl")
                            .font(.caption2)
                    }
                }
            }
            
            // Border token references
            VStack(spacing: 8) {
                Text("Border Token References")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("xs-xl: borderDefault → borderWidth100 (1px)")
                        .font(.caption)
                        .fontDesign(.monospaced)
                    Text("xxl: borderEmphasis → borderWidth200 (2px)")
                        .font(.caption)
                        .fontDesign(.monospaced)
                    Text("xs-xl color: color.avatar.border + opacity.heavy")
                        .font(.caption)
                        .fontDesign(.monospaced)
                    Text("xxl color: color.contrast.onSurface (full opacity)")
                        .font(.caption)
                        .fontDesign(.monospaced)
                }
            }
        }
    }
}

// MARK: - Individual Preview Sections

/**
 * Compact preview showing just the type/size grid.
 * Useful for quick visual verification.
 */
struct AvatarPreview_TypeSizeGrid_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 24) {
            Text("Avatar Type/Size Grid")
                .font(.headline)
            
            // Human row
            HStack(alignment: .bottom, spacing: 12) {
                Text("Human")
                    .font(.caption)
                    .frame(width: 50, alignment: .leading)
                ForEach(AvatarSize.allCases, id: \.self) { size in
                    Avatar(type: .human, size: size)
                }
            }
            
            // Agent row
            HStack(alignment: .bottom, spacing: 12) {
                Text("Agent")
                    .font(.caption)
                    .frame(width: 50, alignment: .leading)
                ForEach(AvatarSize.allCases, id: \.self) { size in
                    Avatar(type: .agent, size: size)
                }
            }
            
            // Size labels
            HStack(spacing: 12) {
                Text("")
                    .frame(width: 50)
                ForEach(AvatarSize.allCases, id: \.self) { size in
                    Text(size.rawValue)
                        .font(.caption2)
                        .frame(width: size.dimension)
                }
            }
        }
        .padding()
        .previewDisplayName("Type/Size Grid")
    }
}

/**
 * Preview showing interactive hover behavior.
 * Best viewed in Xcode's interactive preview mode.
 */
struct AvatarPreview_Interactive_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 24) {
            Text("Interactive Avatars")
                .font(.headline)
            
            Text("Hover to see border width increase")
                .font(.caption)
                .foregroundColor(.secondary)
            
            HStack(spacing: 32) {
                VStack(spacing: 8) {
                    Avatar(type: .human, size: .xl, interactive: true)
                    Text("Human")
                        .font(.caption)
                }
                
                VStack(spacing: 8) {
                    Avatar(type: .agent, size: .xl, interactive: true)
                    Text("Agent")
                        .font(.caption)
                }
            }
        }
        .padding()
        .previewDisplayName("Interactive")
    }
}

/**
 * Preview showing image loading behavior.
 */
struct AvatarPreview_Images_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 24) {
            Text("Image Avatars")
                .font(.headline)
            
            HStack(spacing: 24) {
                Avatar(
                    type: .human,
                    size: .lg,
                    src: URL(string: "https://i.pravatar.cc/96?img=1"),
                    alt: "User 1"
                )
                
                Avatar(
                    type: .human,
                    size: .lg,
                    src: URL(string: "https://i.pravatar.cc/96?img=2"),
                    alt: "User 2"
                )
                
                Avatar(
                    type: .human,
                    size: .lg,
                    src: URL(string: "https://i.pravatar.cc/96?img=3"),
                    alt: "User 3"
                )
            }
        }
        .padding()
        .previewDisplayName("Images")
    }
}

/**
 * Dark mode preview for visual consistency verification.
 */
struct AvatarPreview_DarkMode_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 24) {
            Text("Dark Mode")
                .font(.headline)
            
            HStack(spacing: 24) {
                VStack(spacing: 8) {
                    Avatar(type: .human, size: .lg)
                    Text("Human")
                        .font(.caption)
                }
                
                VStack(spacing: 8) {
                    Avatar(type: .agent, size: .lg)
                    Text("Agent")
                        .font(.caption)
                }
            }
            
            HStack(spacing: 24) {
                Avatar(type: .human, size: .xxl)
                Avatar(type: .agent, size: .xxl)
            }
        }
        .padding()
        .preferredColorScheme(.dark)
        .previewDisplayName("Dark Mode")
    }
}
