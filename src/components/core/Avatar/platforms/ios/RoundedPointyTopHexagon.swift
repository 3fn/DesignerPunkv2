/**
 * RoundedPointyTopHexagon Shape
 * 
 * A custom SwiftUI Shape that renders a regular hexagon with pointy-top orientation
 * and rounded corners at each vertex.
 * 
 * Geometry:
 * - Pointy-top orientation: vertex at top and bottom, flat edges on sides
 * - Aspect ratio: width = height × cos(30°) ≈ height × 0.866
 * - Internal angle: 120° at each vertex
 * - Rounded corners using addArc for smooth vertex transitions
 * 
 * This shape is used for AI agent avatars to visually distinguish them from
 * human avatars (which use Circle). The hexagon represents the "synthetic,
 * constructed" nature of AI agents.
 * 
 * @see .kiro/specs/042-avatar-component/design.md for implementation details
 * @see .kiro/specs/042-avatar-component/requirements.md Requirements 12.1, 12.2, 12.3
 */

import SwiftUI

// MARK: - RoundedPointyTopHexagon Shape

/**
 * Custom Shape conforming struct for rounded hexagon.
 * 
 * Implements SwiftUI's Shape protocol to create a hexagon path with:
 * - Pointy-top orientation (vertex at top)
 * - Rounded corners at each vertex using addArc
 * - Correct aspect ratio of cos(30°) ≈ 0.866
 * 
 * Usage:
 * ```swift
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
    
    /**
     * Corner radius as a proportion of the smaller dimension.
     * 
     * This value determines how rounded the hexagon corners appear.
     * A value of 0.08 provides subtle rounding that matches the web
     * implementation's SVG clipPath approach.
     * 
     * @see Requirements: 1.4 - Apply rounded corners to hexagon vertices
     */
    private let cornerRadiusFactor: CGFloat = 0.08
    
    // MARK: - Initialization
    
    /**
     * Initialize RoundedPointyTopHexagon with default corner radius.
     */
    public init() {}
    
    // MARK: - Shape Protocol
    
    /**
     * Creates the hexagon path within the given rectangle.
     * 
     * The path is constructed by:
     * 1. Calculating the six vertex positions for a pointy-top hexagon
     * 2. Drawing lines between vertices with rounded corners using addArc
     * 
     * The hexagon is centered within the rect and scaled to fit while
     * maintaining the correct aspect ratio.
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
        
        // Calculate corner radius based on smaller dimension
        let cornerRadius = min(width, height) * cornerRadiusFactor
        
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
        let vertices = calculateVertices(width: width, height: height, rect: rect)
        
        // Start path at a point offset from vertex 0 (top)
        // We start slightly down the edge toward vertex 1 to allow for the rounded corner
        let startPoint = pointOnLine(from: vertices[0], to: vertices[1], distance: cornerRadius)
        path.move(to: startPoint)
        
        // Draw each edge with rounded corner at the end vertex
        for i in 0..<6 {
            let currentVertex = vertices[i]
            let nextVertex = vertices[(i + 1) % 6]
            let afterNextVertex = vertices[(i + 2) % 6]
            
            // Calculate the point where we stop before the corner
            let cornerStart = pointOnLine(from: nextVertex, to: currentVertex, distance: cornerRadius)
            
            // Calculate the point where we resume after the corner
            let cornerEnd = pointOnLine(from: nextVertex, to: afterNextVertex, distance: cornerRadius)
            
            // Draw line to corner start
            path.addLine(to: cornerStart)
            
            // Draw rounded corner using quadratic curve
            // This creates a smooth transition at each vertex
            path.addQuadCurve(to: cornerEnd, control: nextVertex)
        }
        
        path.closeSubpath()
        return path
    }
    
    // MARK: - Vertex Calculation
    
    /**
     * Calculates the six vertex positions for a pointy-top hexagon.
     * 
     * Vertex positions for pointy-top orientation:
     * - Vertex 0: Top center
     * - Vertex 1: Upper right
     * - Vertex 2: Lower right
     * - Vertex 3: Bottom center
     * - Vertex 4: Lower left
     * - Vertex 5: Upper left
     * 
     * The hexagon is centered within the bounding rect.
     * 
     * @param width The width of the bounding rect
     * @param height The height of the bounding rect
     * @param rect The bounding rectangle
     * @return Array of 6 CGPoint vertices
     */
    private func calculateVertices(width: CGFloat, height: CGFloat, rect: CGRect) -> [CGPoint] {
        let centerX = rect.midX
        let centerY = rect.midY
        
        // For pointy-top hexagon:
        // - Height is the full vertical extent (top vertex to bottom vertex)
        // - Width is the horizontal extent (left edge to right edge)
        
        let halfHeight = height / 2
        let halfWidth = width / 2
        
        // Quarter height for the intermediate vertices
        let quarterHeight = height / 4
        
        return [
            // Vertex 0: Top center
            CGPoint(x: centerX, y: rect.minY),
            
            // Vertex 1: Upper right
            CGPoint(x: rect.maxX, y: centerY - quarterHeight),
            
            // Vertex 2: Lower right
            CGPoint(x: rect.maxX, y: centerY + quarterHeight),
            
            // Vertex 3: Bottom center
            CGPoint(x: centerX, y: rect.maxY),
            
            // Vertex 4: Lower left
            CGPoint(x: rect.minX, y: centerY + quarterHeight),
            
            // Vertex 5: Upper left
            CGPoint(x: rect.minX, y: centerY - quarterHeight)
        ]
    }
    
    // MARK: - Helper Methods
    
    /**
     * Calculates a point on the line from `from` to `to` at the specified distance from `from`.
     * 
     * Used to find the start and end points of rounded corners, which are
     * offset from the vertex by the corner radius.
     * 
     * @param from The starting point of the line
     * @param to The ending point of the line
     * @param distance The distance from `from` along the line
     * @return The calculated point
     */
    private func pointOnLine(from: CGPoint, to: CGPoint, distance: CGFloat) -> CGPoint {
        let dx = to.x - from.x
        let dy = to.y - from.y
        let length = sqrt(dx * dx + dy * dy)
        
        guard length > 0 else { return from }
        
        let ratio = distance / length
        return CGPoint(
            x: from.x + dx * ratio,
            y: from.y + dy * ratio
        )
    }
}

// MARK: - Preview

/**
 * SwiftUI Preview for RoundedPointyTopHexagon shape.
 * 
 * Demonstrates the shape at various sizes and with different styling options.
 */
struct RoundedPointyTopHexagon_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 24) {
            Text("RoundedPointyTopHexagon Shape")
                .font(.headline)
            
            // Basic filled hexagon
            RoundedPointyTopHexagon()
                .fill(Color.teal)
                .frame(width: 100 * RoundedPointyTopHexagon.aspectRatio, height: 100)
            
            // Stroked hexagon
            RoundedPointyTopHexagon()
                .stroke(Color.blue, lineWidth: 2)
                .frame(width: 80 * RoundedPointyTopHexagon.aspectRatio, height: 80)
            
            // Various sizes
            HStack(spacing: 16) {
                ForEach([24, 40, 64, 100], id: \.self) { size in
                    RoundedPointyTopHexagon()
                        .fill(Color.orange)
                        .frame(
                            width: CGFloat(size) * RoundedPointyTopHexagon.aspectRatio,
                            height: CGFloat(size)
                        )
                }
            }
            
            // As clip shape for image
            Text("As ClipShape")
                .font(.subheadline)
            
            Color.purple
                .frame(width: 120 * RoundedPointyTopHexagon.aspectRatio, height: 120)
                .clipShape(RoundedPointyTopHexagon())
                .overlay(
                    RoundedPointyTopHexagon()
                        .stroke(Color.white, lineWidth: 2)
                )
        }
        .padding()
    }
}
