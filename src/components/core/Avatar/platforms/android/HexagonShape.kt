/**
 * HexagonShape for Jetpack Compose
 * 
 * Custom Shape implementing class for rendering hexagon avatars.
 * Uses quadraticBezierTo for rounded corners at vertices.
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
 * @see .kiro/specs/042-avatar-component/requirements.md Requirements 13.1-13.3
 */

package com.designerpunk.components.avatar

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Outline
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.LayoutDirection
import kotlin.math.cos
import kotlin.math.min

// MARK: - HexagonShape

/**
 * Custom Shape implementing class for rounded hexagon.
 * 
 * Implements Compose's Shape interface to create a hexagon path with:
 * - Pointy-top orientation (vertex at top)
 * - Rounded corners at each vertex using quadraticBezierTo
 * - Correct aspect ratio of cos(30°) ≈ 0.866
 * 
 * Usage:
 * ```kotlin
 * // Default initialization (5% corner radius)
 * HexagonShape()
 * 
 * // Custom corner radius
 * HexagonShape(cornerRadiusFraction = 0.08f)
 * 
 * // As clip modifier
 * Box(
 *     modifier = Modifier
 *         .size(80.dp)
 *         .clip(HexagonShape())
 *         .background(Color.Teal)
 * )
 * 
 * // As border shape
 * Box(
 *     modifier = Modifier
 *         .size(80.dp)
 *         .border(1.dp, Color.Gray, HexagonShape())
 * )
 * ```
 * 
 * @param cornerRadiusFraction Corner radius as fraction of min dimension (0.0 to 0.5)
 * 
 * @see Requirements: 13.1 - Custom GenericShape with hexagon path
 * @see Requirements: 13.2 - Use quadraticBezierTo for rounded vertices
 * @see Requirements: 13.3 - Apply Modifier.clip() with custom shape
 */
class HexagonShape(
    private val cornerRadiusFraction: Float = DEFAULT_CORNER_RADIUS_FRACTION
) : Shape {
    
    companion object {
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
        val ASPECT_RATIO: Float = cos(Math.PI / 6).toFloat() // cos(30°) ≈ 0.866025
        
        /**
         * Default corner radius as a fraction of the smaller dimension.
         * 
         * Default is 0.05 (5%) which provides subtle rounding matching the web
         * implementation's SVG clipPath approach.
         * 
         * @see Requirements: 1.4 - Apply rounded corners to hexagon vertices
         */
        const val DEFAULT_CORNER_RADIUS_FRACTION: Float = 0.05f
    }
    
    /**
     * Creates the hexagon outline within the given size.
     * 
     * The outline is constructed by:
     * 1. Calculating the six vertex positions for a pointy-top hexagon
     * 2. Using quadraticBezierTo for smooth rounded corners at each vertex
     * 
     * The quadraticBezierTo approach:
     * 1. For each vertex, we calculate points slightly before and after the vertex
     * 2. We draw a line to the "before" point
     * 3. We use quadraticBezierTo with the vertex as control point and "after" point as end
     * 4. This creates a smooth curve that rounds the corner
     * 
     * @param size The size of the bounding box
     * @param layoutDirection The layout direction (LTR or RTL)
     * @param density The density for converting dp to pixels
     * @return An Outline.Generic containing the hexagon path
     * 
     * @see Requirements: 13.1 - Implement createOutline() method with hexagon path
     * @see Requirements: 13.2 - Use quadraticBezierTo for rounded corners at vertices
     */
    override fun createOutline(
        size: Size,
        layoutDirection: LayoutDirection,
        density: Density
    ): Outline {
        val path = createHexagonPath(size)
        return Outline.Generic(path)
    }
    
    /**
     * Creates the hexagon path with rounded corners.
     * 
     * @param size The size of the bounding box
     * @return A Path representing the rounded hexagon
     */
    private fun createHexagonPath(size: Size): Path {
        val width = size.width
        val height = size.height
        val centerX = width / 2f
        val centerY = height / 2f
        
        // Calculate corner radius based on smaller dimension
        // Clamp cornerRadiusFraction to valid range [0, 0.5]
        val clampedFraction = cornerRadiusFraction.coerceIn(0f, 0.5f)
        val cornerRadius = min(width, height) * clampedFraction
        
        // Calculate effective half-width to handle non-ideal aspect ratios
        // This ensures the hexagon renders correctly even in non-ideal containers
        val halfWidth = (height / 2f) * ASPECT_RATIO
        val effectiveHalfWidth = min(halfWidth, width / 2f)
        
        // Quarter height for intermediate vertices
        val quarterHeight = height / 4f
        
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
        val vertices = listOf(
            // Vertex 0: Top center (0.5, 0)
            Offset(centerX, 0f),
            
            // Vertex 1: Upper right (0.933, 0.25)
            Offset(centerX + effectiveHalfWidth, centerY - quarterHeight),
            
            // Vertex 2: Lower right (0.933, 0.75)
            Offset(centerX + effectiveHalfWidth, centerY + quarterHeight),
            
            // Vertex 3: Bottom center (0.5, 1.0)
            Offset(centerX, height),
            
            // Vertex 4: Lower left (0.067, 0.75)
            Offset(centerX - effectiveHalfWidth, centerY + quarterHeight),
            
            // Vertex 5: Upper left (0.067, 0.25)
            Offset(centerX - effectiveHalfWidth, centerY - quarterHeight)
        )
        
        return Path().apply {
            // Calculate the rounding factor based on corner radius
            // This determines how far from the vertex we start/end the curve
            val roundingFactor = calculateRoundingFactor(vertices, cornerRadius)
            
            // Start at a point on the edge between vertex 5 and vertex 0
            // (slightly before vertex 0 to allow for the rounded corner)
            val startPoint = interpolate(vertices[5], vertices[0], 1f - roundingFactor)
            moveTo(startPoint.x, startPoint.y)
            
            // Draw each edge with rounded corner at the end vertex
            for (i in 0 until 6) {
                val currentVertex = vertices[i]
                val nextVertex = vertices[(i + 1) % 6]
                
                // Point just before the current vertex (end of previous edge)
                val beforeVertex = interpolate(vertices[(i + 5) % 6], currentVertex, 1f - roundingFactor)
                
                // Point just after the current vertex (start of next edge)
                val afterVertex = interpolate(currentVertex, nextVertex, roundingFactor)
                
                // If this is not the first vertex, draw line to before point
                if (i > 0) {
                    lineTo(beforeVertex.x, beforeVertex.y)
                }
                
                // Draw quadratic bezier curve for rounded corner
                // Control point is the actual vertex
                // End point is slightly after the vertex on the next edge
                quadraticBezierTo(
                    currentVertex.x, currentVertex.y,  // Control point (vertex)
                    afterVertex.x, afterVertex.y       // End point (after vertex)
                )
            }
            
            // Close the path by drawing line back to start
            close()
        }
    }
    
    /**
     * Calculates the rounding factor based on corner radius and edge lengths.
     * 
     * The rounding factor determines what fraction of each edge is used for
     * the rounded corner. It's calculated to ensure the corner radius doesn't
     * exceed half of the shortest edge.
     * 
     * @param vertices The six vertices of the hexagon
     * @param cornerRadius The desired corner radius in pixels
     * @return A factor between 0 and 0.5 representing the fraction of edge used for rounding
     */
    private fun calculateRoundingFactor(vertices: List<Offset>, cornerRadius: Float): Float {
        if (cornerRadius <= 0f) return 0f
        
        // Find the shortest edge length
        var minEdgeLength = Float.MAX_VALUE
        for (i in 0 until 6) {
            val current = vertices[i]
            val next = vertices[(i + 1) % 6]
            val edgeLength = distance(current, next)
            if (edgeLength < minEdgeLength) {
                minEdgeLength = edgeLength
            }
        }
        
        // Calculate rounding factor, ensuring it doesn't exceed half the shortest edge
        // This prevents corners from overlapping
        val maxRoundingFactor = 0.5f
        val desiredFactor = cornerRadius / (minEdgeLength / 2f)
        
        return desiredFactor.coerceIn(0f, maxRoundingFactor)
    }
    
    /**
     * Calculates the distance between two points.
     * 
     * @param p1 First point
     * @param p2 Second point
     * @return The Euclidean distance between the points
     */
    private fun distance(p1: Offset, p2: Offset): Float {
        val dx = p2.x - p1.x
        val dy = p2.y - p1.y
        return kotlin.math.sqrt(dx * dx + dy * dy)
    }
    
    /**
     * Linearly interpolates between two points.
     * 
     * @param start Starting point
     * @param end Ending point
     * @param fraction Interpolation factor (0 = start, 1 = end)
     * @return The interpolated point
     */
    private fun interpolate(start: Offset, end: Offset, fraction: Float): Offset {
        return Offset(
            x = start.x + (end.x - start.x) * fraction,
            y = start.y + (end.y - start.y) * fraction
        )
    }
    
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is HexagonShape) return false
        return cornerRadiusFraction == other.cornerRadiusFraction
    }
    
    override fun hashCode(): Int {
        return cornerRadiusFraction.hashCode()
    }
    
    override fun toString(): String {
        return "HexagonShape(cornerRadiusFraction=$cornerRadiusFraction)"
    }
}
