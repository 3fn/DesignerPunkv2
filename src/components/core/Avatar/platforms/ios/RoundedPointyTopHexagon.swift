/**
 * RoundedPointyTopHexagon Shape for SwiftUI
 * 
 * Custom Shape conforming struct for rendering hexagon avatars.
 * Uses addArc(tangent1End:tangent2End:radius:) for smooth rounded corners at vertices.
 * 
 * Hexagon geometry:
 * - Pointy-top orientation (vertex at top)
 * - Aspect ratio: cos(30°) ≈ 0.866 (width = height × 0.866)
 * - Corner radius: 5% of min dimension (subtle rounding matching web SVG clipPath)
 * 
 * Vertex positions (normalized to bounding box):
 * - Top:          (0.5, 0)
 * - Top-right:    (0.933, 0.25)
 * - Bottom-right: (0.933, 0.75)
 * - Bottom:       (0.5, 1.0)
 * - Bottom-left:  (0.067, 0.75)
 * - Top-left:     (0.067, 0.25)
 * 
 * The x-coordinates 0.933 and 0.067 derive from:
 * - Center at 0.5
 * - Half-width = 0.5 × cos(30°) ≈ 0.433
 * - Right edge: 0.5 + 0.433 = 0.933
 * - Left edge: 0.5 - 0.433 = 0.067
 * 
 * @see .kiro/specs/042-avatar-component/design.md for implementation details
 * @see .kiro/specs/042-avatar-component/requirements.md Requirements 12.1-12.3
 */

import SwiftUI

// MARK: - RoundedPointyTopHexagon Shape

/**
 * Custom Shape conforming struct for rounded hexagon.
 * 
 * Implements SwiftUI's Shape protocol to create a hexagon path with:
 * - Pointy-top orientation (vertex at top)
 * - Rounded corners at each vertex using addArc(tangent1End:tangent2End:radius:)
 * - Correct aspect ratio of cos(30°) ≈ 0.866
 * 
 * Usage:
 * ```swift
 * // Default initialization (5% corner radius)
 * RoundedPointyTopHexagon()
 * 
 * // Custom corner radius
 * RoundedPointyTopHexagon(cornerRadiusFraction: 0.08)
 * 
 * // As clip shape
 * Image("photo")
 *     .clipShape(RoundedPointyTopHexagon())
 * 
 * // As stroke
 * RoundedPointyTopHexagon()
 *     .stroke(Color.blue, lineWidth: 2)
 * 
 * // As fill
 * RoundedPointyTopHexagon()
 *     .fill(Color.teal)
 * ```
 * 
 * @see Requirements: 12.1 - Custom RoundedPointyTopHexagon Shape
 * @see Requirements: 12.2 - Use addArc for rounded vertices
 * @see Requirements: 12.3 - Apply .clipShape() modifier
 */
public struct RoundedPointyTopHexagon: Shape {
    
    // MARK: - Constants
    
    /**
     * Aspect ratio for pointy-top hexagon.
     * 
     * For a regular hexagon with pointy-top orientation:
     * - width = height × cos(30°)
     * - cos(30°) = √3/2 ≈ 0.866025
     * 
     * This ensures the hexagon maintains proper proportions regardless of size.
     * 
     * @see Requirements: 1.3 - Hexagon aspect ratio of cos(30°) ≈ 0.866
     */
    public static let aspectRatio: CGFloat = cos(.pi / 6) // cos(30°) ≈ 0.866025
    
    // MARK: - Properties
    
    /**
     * Corner radius as a fraction of the smaller dimension.
     * 
     * Default is 0.05 (5%) which provides subtle rounding matching the web
     * implementation's SVG clipPath approach.
     * 
     * @see Requirements: 1.4 - Apply rounded corners to hexagon vertices
     */
    private let cornerRadiusFraction: CGFloat
    
    // MARK: - Initialization
    
    /**
     * Initialize RoundedPointyTopHexagon with default corner radius (5%).
     */
    public init() {
        self.cornerRadiusFraction = 0.05
    }
    
    /**
     * Initialize RoundedPointyTopHexagon with custom corner radius fraction.
     * 
     * - Parameter cornerRadiusFraction: Corner radius as fraction of min dimension (0.0 to 0.5)
     */
    public init(cornerRadiusFraction: CGFloat) {
        self.cornerRadiusFraction = max(0, min(0.5, cornerRadiusFraction))
    }
    
    // MARK: - Shape Protocol
    
    /**
     * Creates the hexagon path within the given rectangle.
     * 
     * The path is constructed by:
     * 1. Calculating the six vertex positions for a pointy-top hexagon
     * 2. Using addArc(tangent1End:tangent2End:radius:) for smooth rounded corners
     * 
     * The addArc approach:
     * 1. Draws a line from the current point toward tangent1End
     * 2. Creates an arc that smoothly transitions to a line toward tangent2End
     * 3. The arc has the specified radius and is tangent to both lines
     * 
     * This is more elegant than manually calculating arc centers and angles.
     * 
     * @param rect The bounding rectangle for the shape
     * @return A Path representing the rounded hexagon
     * 
     * @see Requirements: 12.1 - Implement path(in:) method with hexagon vertices
     * @see Requirements: 12.2 - Use addArc for rounded corners at vertices
     */
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        
        let width = rect.width
        let height = rect.height
        let centerX = rect.midX
        let centerY = rect.midY
        
        // Calculate corner radius based on smaller dimension
        let cornerRadius = min(width, height) * cornerRadiusFraction
        
        // Calculate effective half-width to handle non-ideal aspect ratios
        // This ensures the hexagon renders correctly even in non-ideal containers
        let halfWidth = (height / 2) * Self.aspectRatio
        let effectiveHalfWidth = min(halfWidth, width / 2)
        
        // Quarter height for intermediate vertices
        let quarterHeight = height / 4
        
        // Calculate hexagon vertices (pointy-top orientation)
        // Vertices are numbered 0-5 starting from top, going clockwise
        //
        //        0 (top)
        //       / \
        //      /   \
        //     5     1
        //     |     |
        //     4     2
        //      \   /
        //       \ /
        //        3 (bottom)
        //
        let vertices: [CGPoint] = [
            // Vertex 0: Top center (0.5, 0)
            CGPoint(x: centerX, y: rect.minY),
            
            // Vertex 1: Upper right (0.933, 0.25)
            CGPoint(x: centerX + effectiveHalfWidth, y: centerY - quarterHeight),
            
            // Vertex 2: Lower right (0.933, 0.75)
            CGPoint(x: centerX + effectiveHalfWidth, y: centerY + quarterHeight),
            
            // Vertex 3: Bottom center (0.5, 1.0)
            CGPoint(x: centerX, y: rect.maxY),
            
            // Vertex 4: Lower left (0.067, 0.75)
            CGPoint(x: centerX - effectiveHalfWidth, y: centerY + quarterHeight),
            
            // Vertex 5: Upper left (0.067, 0.25)
            CGPoint(x: centerX - effectiveHalfWidth, y: centerY - quarterHeight)
        ]
        
        // Start at vertex 0 (top)
        path.move(to: vertices[0])
        
        // Draw each edge with rounded corner at the end vertex using addArc
        // addArc(tangent1End:tangent2End:radius:) creates smooth transitions
        for i in 0..<6 {
            let nextVertex = vertices[(i + 1) % 6]
            let afterNextVertex = vertices[(i + 2) % 6]
            
            // Add arc that rounds the corner at nextVertex
            // The arc is tangent to the line from current position to nextVertex
            // and tangent to the line from nextVertex to afterNextVertex
            path.addArc(tangent1End: nextVertex, tangent2End: afterNextVertex, radius: cornerRadius)
        }
        
        path.closeSubpath()
        return path
    }
}

// MARK: - Preview

/**
 * SwiftUI Preview for RoundedPointyTopHexagon shape.
 * 
 * Demonstrates:
 * - All six avatar sizes (xs through xxl)
 * - Stroke variant
 * - Corner radius variants (0%, 5%, 10%, 15%)
 * - Avatar usage simulation with icon and border
 */
struct RoundedPointyTopHexagon_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("RoundedPointyTopHexagon Shape")
                    .font(.headline)
                
                // All avatar sizes
                Text("Avatar Sizes")
                    .font(.subheadline)
                
                HStack(spacing: 16) {
                    ForEach([24, 32, 40, 48, 80, 128], id: \.self) { size in
                        VStack {
                            RoundedPointyTopHexagon()
                                .fill(Color.teal)
                                .frame(
                                    width: CGFloat(size) * RoundedPointyTopHexagon.aspectRatio,
                                    height: CGFloat(size)
                                )
                            Text("\(size)pt")
                                .font(.caption2)
                        }
                    }
                }
                
                Divider()
                
                // Stroke variant
                Text("Stroke Variant")
                    .font(.subheadline)
                
                RoundedPointyTopHexagon()
                    .stroke(Color.blue, lineWidth: 2)
                    .frame(width: 80 * RoundedPointyTopHexagon.aspectRatio, height: 80)
                
                Divider()
                
                // Corner radius variants
                Text("Corner Radius Variants")
                    .font(.subheadline)
                
                HStack(spacing: 16) {
                    ForEach([0.0, 0.05, 0.10, 0.15], id: \.self) { radius in
                        VStack {
                            RoundedPointyTopHexagon(cornerRadiusFraction: radius)
                                .fill(Color.orange)
                                .frame(width: 60 * RoundedPointyTopHexagon.aspectRatio, height: 60)
                            Text("\(Int(radius * 100))%")
                                .font(.caption2)
                        }
                    }
                }
                
                Divider()
                
                // Avatar simulation
                Text("Avatar Simulation")
                    .font(.subheadline)
                
                ZStack {
                    RoundedPointyTopHexagon()
                        .fill(Color.teal)
                    
                    Image(systemName: "sparkles")
                        .font(.system(size: 40))
                        .foregroundColor(.white)
                }
                .frame(width: 80 * RoundedPointyTopHexagon.aspectRatio, height: 80)
                .overlay(
                    RoundedPointyTopHexagon()
                        .stroke(Color.gray.opacity(0.48), lineWidth: 1)
                )
            }
            .padding()
        }
    }
}
