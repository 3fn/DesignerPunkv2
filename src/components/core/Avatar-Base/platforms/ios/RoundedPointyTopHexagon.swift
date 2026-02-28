/**
 * RoundedPointyTopHexagon Shape for SwiftUI
 * 
 * Custom Shape conforming struct for rendering hexagon avatars.
 * Uses quadratic Bézier curves for smooth rounded corners at vertices,
 * matching the web implementation's SVG path approach.
 * 
 * Hexagon geometry:
 * - Pointy-top orientation (vertex at top)
 * - 1:1 aspect ratio (square bounding box, hexagon fits inside)
 * - Corner radius: 8% of size (matching web implementation)
 * 
 * The hexagon is inscribed within a square bounding box:
 * - Height spans full size
 * - Width = Height × cos(30°) ≈ 0.866 (hexagon is narrower than square)
 * - Hexagon is centered horizontally within the square
 * 
 * Vertex positions (relative to square bounding box):
 * - Top:          (0.5, 0)
 * - Top-right:    (0.5 + halfWidth, 0.25)
 * - Bottom-right: (0.5 + halfWidth, 0.75)
 * - Bottom:       (0.5, 1.0)
 * - Bottom-left:  (0.5 - halfWidth, 0.75)
 * - Top-left:     (0.5 - halfWidth, 0.25)
 * 
 * Where halfWidth = 0.5 × cos(30°) ≈ 0.433
 * 
 * @see .kiro/specs/042-avatar-component/design.md for implementation details
 * @see .kiro/specs/042-avatar-component/requirements.md Requirements 12.1-12.4
 */

import SwiftUI

// MARK: - RoundedPointyTopHexagon Shape

/**
 * Custom Shape conforming struct for rounded hexagon.
 * 
 * Implements SwiftUI's Shape protocol to create a hexagon path with:
 * - Pointy-top orientation (vertex at top)
 * - Rounded corners using quadratic Bézier curves (matching web SVG approach)
 * - 1:1 aspect ratio (square bounding box)
 * 
 * Usage:
 * ```swift
 * // Default initialization (8% corner radius)
 * RoundedPointyTopHexagon()
 * 
 * // Custom corner radius
 * RoundedPointyTopHexagon(cornerRadiusFraction: 0.05)
 * 
 * // As clip shape
 * Image("photo")
 *     .clipShape(RoundedPointyTopHexagon())
 * 
 * // As stroke (for borders)
 * RoundedPointyTopHexagon()
 *     .stroke(Color.blue, lineWidth: 2)
 * 
 * // As fill
 * RoundedPointyTopHexagon()
 *     .fill(Color.teal)
 * ```
 * 
 * @see Requirements: 12.1 - Custom RoundedPointyTopHexagon Shape
 * @see Requirements: 12.2 - Use quadratic curves for rounded vertices
 * @see Requirements: 12.3 - Apply .clipShape() modifier
 * @see Requirements: 12.4 - 1:1 aspect ratio (square bounding box)
 */
public struct RoundedPointyTopHexagon: Shape {
    
    // MARK: - Constants
    
    /**
     * Hexagon width-to-height ratio for pointy-top orientation.
     * 
     * For a regular hexagon with pointy-top orientation:
     * - width = height × cos(30°)
     * - cos(30°) = √3/2 ≈ 0.866025
     * 
     * Note: The bounding box is now 1:1 (square), but the hexagon inside
     * maintains this ratio. The hexagon is centered horizontally.
     * 
     * @see Requirements: 1.3 - Hexagon proportions
     */
    public static let hexagonRatio: CGFloat = cos(.pi / 6) // cos(30°) ≈ 0.866025
    
    /**
     * Aspect ratio for the bounding box.
     * 
     * Changed from 0.866 to 1.0 (square) for visual balance and consistency
     * with the web implementation. The hexagon fits inside the square.
     * 
     * @see Requirements: 12.4 - 1:1 aspect ratio
     */
    public static let aspectRatio: CGFloat = 1.0
    
    // MARK: - Properties
    
    /**
     * Corner radius as a fraction of the size.
     * 
     * Default is 0.08 (8%) which matches the web implementation's
     * SVG Bézier curve approach for visually pleasing rounded corners.
     * 
     * @see Requirements: 1.4 - Apply rounded corners to hexagon vertices
     */
    private let cornerRadiusFraction: CGFloat
    
    // MARK: - Initialization
    
    /**
     * Initialize RoundedPointyTopHexagon with default corner radius (8%).
     * Matches web implementation's default corner radius.
     */
    public init() {
        self.cornerRadiusFraction = 0.08
    }
    
    /**
     * Initialize RoundedPointyTopHexagon with custom corner radius fraction.
     * 
     * - Parameter cornerRadiusFraction: Corner radius as fraction of size (0.0 to 0.5)
     */
    public init(cornerRadiusFraction: CGFloat) {
        self.cornerRadiusFraction = max(0, min(0.5, cornerRadiusFraction))
    }
    
    // MARK: - Shape Protocol
    
    /**
     * Creates the hexagon path within the given rectangle using quadratic Bézier curves.
     * 
     * The path is constructed by:
     * 1. Calculating the six vertex positions for a pointy-top hexagon
     * 2. Using quadratic Bézier curves (addQuadCurve) for smooth rounded corners
     * 
     * This approach matches the web implementation's SVG path with Q commands,
     * providing true rounded corners with smooth transitions (no nipple bumps).
     * 
     * Quadratic Bézier curve approach:
     * 1. Calculate points before and after each vertex (offset by corner radius)
     * 2. Draw line to point before vertex
     * 3. Draw quadratic curve through vertex to point after vertex
     * 
     * @param rect The bounding rectangle for the shape (should be square for best results)
     * @return A Path representing the rounded hexagon
     * 
     * @see Requirements: 12.1 - Implement path(in:) method with hexagon vertices
     * @see Requirements: 12.2 - Use quadratic curves for rounded corners at vertices
     */
    public func path(in rect: CGRect) -> Path {
        var path = Path()
        
        // Use the smaller dimension to ensure hexagon fits in non-square containers
        let size = min(rect.width, rect.height)
        let centerX = rect.midX
        let centerY = rect.midY
        
        // Calculate corner radius (8% of size by default)
        let cornerRadius = size * cornerRadiusFraction
        
        // Hexagon dimensions (fits inside square bounding box)
        // Height spans full size, width is narrower due to hexagon proportions
        let hexHeight = size
        let hexWidth = size * Self.hexagonRatio // cos(30°) ≈ 0.866
        
        // Calculate vertex positions (pointy-top orientation)
        // Vertices numbered 0-5 starting from top, going clockwise
        let halfWidth = hexWidth / 2
        let quarterHeight = hexHeight / 4
        
        // Vertex coordinates (clockwise from top)
        let vertices: [CGPoint] = [
            CGPoint(x: centerX, y: centerY - hexHeight / 2),                    // 0: Top vertex
            CGPoint(x: centerX + halfWidth, y: centerY - quarterHeight),        // 1: Top-right vertex
            CGPoint(x: centerX + halfWidth, y: centerY + quarterHeight),        // 2: Bottom-right vertex
            CGPoint(x: centerX, y: centerY + hexHeight / 2),                    // 3: Bottom vertex
            CGPoint(x: centerX - halfWidth, y: centerY + quarterHeight),        // 4: Bottom-left vertex
            CGPoint(x: centerX - halfWidth, y: centerY - quarterHeight),        // 5: Top-left vertex
        ]
        
        let numVertices = vertices.count
        
        // Build path with quadratic Bézier curves at corners
        // For each vertex, we:
        // 1. Draw a line to a point before the vertex (offset by corner radius)
        // 2. Draw a quadratic curve through the vertex to a point after it
        
        for i in 0..<numVertices {
            let curr = vertices[i]
            let next = vertices[(i + 1) % numVertices]
            let prev = vertices[(i - 1 + numVertices) % numVertices]
            
            // Calculate direction vectors
            let toPrev = CGPoint(x: prev.x - curr.x, y: prev.y - curr.y)
            let toNext = CGPoint(x: next.x - curr.x, y: next.y - curr.y)
            
            // Normalize direction vectors
            let lenToPrev = sqrt(toPrev.x * toPrev.x + toPrev.y * toPrev.y)
            let lenToNext = sqrt(toNext.x * toNext.x + toNext.y * toNext.y)
            
            let normToPrev = CGPoint(x: toPrev.x / lenToPrev, y: toPrev.y / lenToPrev)
            let normToNext = CGPoint(x: toNext.x / lenToNext, y: toNext.y / lenToNext)
            
            // Calculate points before and after the vertex (offset by corner radius)
            let beforeVertex = CGPoint(
                x: curr.x + normToPrev.x * cornerRadius,
                y: curr.y + normToPrev.y * cornerRadius
            )
            let afterVertex = CGPoint(
                x: curr.x + normToNext.x * cornerRadius,
                y: curr.y + normToNext.y * cornerRadius
            )
            
            if i == 0 {
                // Start path at the point after the first vertex
                path.move(to: afterVertex)
            } else {
                // Line to point before current vertex
                path.addLine(to: beforeVertex)
                // Quadratic curve through vertex to point after vertex
                path.addQuadCurve(to: afterVertex, control: curr)
            }
        }
        
        // Close the path: line to before first vertex, then curve through it
        let firstVertex = vertices[0]
        let secondVertex = vertices[1]
        let lastVertex = vertices[numVertices - 1]
        
        // Direction from first vertex to last and to second
        let toLastFromFirst = CGPoint(x: lastVertex.x - firstVertex.x, y: lastVertex.y - firstVertex.y)
        let toSecondFromFirst = CGPoint(x: secondVertex.x - firstVertex.x, y: secondVertex.y - firstVertex.y)
        
        let lenToLast = sqrt(toLastFromFirst.x * toLastFromFirst.x + toLastFromFirst.y * toLastFromFirst.y)
        let lenToSecond = sqrt(toSecondFromFirst.x * toSecondFromFirst.x + toSecondFromFirst.y * toSecondFromFirst.y)
        
        let normToLast = CGPoint(x: toLastFromFirst.x / lenToLast, y: toLastFromFirst.y / lenToLast)
        let normToSecond = CGPoint(x: toSecondFromFirst.x / lenToSecond, y: toSecondFromFirst.y / lenToSecond)
        
        let beforeFirst = CGPoint(
            x: firstVertex.x + normToLast.x * cornerRadius,
            y: firstVertex.y + normToLast.y * cornerRadius
        )
        let afterFirst = CGPoint(
            x: firstVertex.x + normToSecond.x * cornerRadius,
            y: firstVertex.y + normToSecond.y * cornerRadius
        )
        
        // Line to before first vertex
        path.addLine(to: beforeFirst)
        // Curve through first vertex back to start point
        path.addQuadCurve(to: afterFirst, control: firstVertex)
        
        // Close path
        path.closeSubpath()
        
        return path
    }
}

// MARK: - Preview

/**
 * SwiftUI Preview for RoundedPointyTopHexagon shape.
 * 
 * Demonstrates:
 * - All six avatar sizes (xs through xxl) with 1:1 aspect ratio
 * - Stroke variant
 * - Corner radius variants (0%, 5%, 8%, 10%)
 * - Avatar usage simulation with icon and border
 * 
 * Note: Uses 1:1 aspect ratio (square frames) matching web implementation.
 * The hexagon fits inside the square bounding box.
 */
struct RoundedPointyTopHexagon_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("RoundedPointyTopHexagon Shape")
                    .font(.headline)
                
                Text("1:1 Aspect Ratio (Square Bounding Box)")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                // All avatar sizes with 1:1 aspect ratio
                Text("Avatar Sizes (1:1)")
                    .font(.subheadline)
                
                HStack(spacing: 16) {
                    ForEach([24, 32, 40, 48, 80, 128], id: \.self) { size in
                        VStack {
                            RoundedPointyTopHexagon()
                                .fill(Color.teal)
                                .frame(width: CGFloat(size), height: CGFloat(size))
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
                    .frame(width: 80, height: 80)
                
                Divider()
                
                // Corner radius variants (default is now 8%)
                Text("Corner Radius Variants")
                    .font(.subheadline)
                
                HStack(spacing: 16) {
                    ForEach([0.0, 0.05, 0.08, 0.10], id: \.self) { radius in
                        VStack {
                            RoundedPointyTopHexagon(cornerRadiusFraction: radius)
                                .fill(Color.orange)
                                .frame(width: 60, height: 60)
                            Text("\(Int(radius * 100))%")
                                .font(.caption2)
                            if radius == 0.08 {
                                Text("(default)")
                                    .font(.caption2)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                }
                
                Divider()
                
                // Avatar simulation with 1:1 frame
                Text("Avatar Simulation")
                    .font(.subheadline)
                
                ZStack {
                    RoundedPointyTopHexagon()
                        .fill(Color.teal)
                    
                    Image(systemName: "sparkles")
                        .font(.system(size: 40))
                        .foregroundColor(.white)
                }
                .frame(width: 80, height: 80)
                .overlay(
                    RoundedPointyTopHexagon()
                        .stroke(Color.gray.opacity(0.48), lineWidth: 1)
                )
            }
            .padding()
        }
    }
}
