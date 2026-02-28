/**
 * HexagonShape for Jetpack Compose
 * 
 * Custom Shape implementing class for rendering hexagon avatars.
 * Uses quadraticBezierTo for smooth rounded corners at vertices,
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
 * @see .kiro/specs/042-avatar-component/requirements.md Requirements 13.1-13.4
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
import kotlin.math.sqrt

// MARK: - HexagonShape

/**
 * Custom Shape implementing class for rounded hexagon.
 * 
 * Implements Compose's Shape interface to create a hexagon path with:
 * - Pointy-top orientation (vertex at top)
 * - Rounded corners using quadraticBezierTo (matching web SVG approach)
 * - 1:1 aspect ratio (square bounding box)
 * 
 * Usage:
 * ```kotlin
 * // Default initialization (8% corner radius)
 * HexagonShape()
 * 
 * // Custom corner radius
 * HexagonShape(cornerRadiusFraction = 0.05f)
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
 * @see Requirements: 13.4 - 1:1 aspect ratio (square bounding box)
 */
class HexagonShape(
    private val cornerRadiusFraction: Float = DEFAULT_CORNER_RADIUS_FRACTION
) : Shape {
    
    companion object {
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
        val HEXAGON_RATIO: Float = cos(Math.PI / 6).toFloat() // cos(30°) ≈ 0.866025
        
        /**
         * Aspect ratio for the bounding box.
         * 
         * Changed from 0.866 to 1.0 (square) for visual balance and consistency
         * with the web implementation. The hexagon fits inside the square.
         * 
         * @see Requirements: 13.4 - 1:1 aspect ratio
         */
        const val ASPECT_RATIO: Float = 1.0f
        
        /**
         * Default corner radius as a fraction of the size.
         * 
         * Default is 0.08 (8%) which matches the web implementation's
         * SVG Bézier curve approach for visually pleasing rounded corners.
         * 
         * @see Requirements: 1.4 - Apply rounded corners to hexagon vertices
         */
        const val DEFAULT_CORNER_RADIUS_FRACTION: Float = 0.08f
    }
    
    /**
     * Creates the hexagon outline within the given size using quadratic Bézier curves.
     * 
     * The outline is constructed by:
     * 1. Calculating the six vertex positions for a pointy-top hexagon
     * 2. Using quadraticBezierTo for smooth rounded corners at each vertex
     * 
     * This approach matches the web implementation's SVG path with Q commands,
     * providing true rounded corners with smooth transitions (no nipple bumps).
     * 
     * Quadratic Bézier curve approach:
     * 1. Calculate points before and after each vertex (offset by corner radius)
     * 2. Draw line to point before vertex
     * 3. Draw quadratic curve through vertex to point after vertex
     * 
     * @param size The size of the bounding box (should be square for best results)
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
     * Creates the hexagon path with rounded corners using quadratic Bézier curves.
     * 
     * @param size The size of the bounding box
     * @return A Path representing the rounded hexagon
     */
    private fun createHexagonPath(size: Size): Path {
        // Use the smaller dimension to ensure hexagon fits in non-square containers
        val dimension = min(size.width, size.height)
        val centerX = size.width / 2f
        val centerY = size.height / 2f
        
        // Calculate corner radius (8% of size by default)
        val clampedFraction = cornerRadiusFraction.coerceIn(0f, 0.5f)
        val cornerRadius = dimension * clampedFraction
        
        // Hexagon dimensions (fits inside square bounding box)
        // Height spans full size, width is narrower due to hexagon proportions
        val hexHeight = dimension
        val hexWidth = dimension * HEXAGON_RATIO // cos(30°) ≈ 0.866
        
        // Calculate vertex positions (pointy-top orientation)
        // Vertices numbered 0-5 starting from top, going clockwise
        val halfWidth = hexWidth / 2f
        val quarterHeight = hexHeight / 4f
        
        // Vertex coordinates (clockwise from top)
        val vertices = listOf(
            // Vertex 0: Top center
            Offset(centerX, centerY - hexHeight / 2f),
            
            // Vertex 1: Top-right
            Offset(centerX + halfWidth, centerY - quarterHeight),
            
            // Vertex 2: Bottom-right
            Offset(centerX + halfWidth, centerY + quarterHeight),
            
            // Vertex 3: Bottom center
            Offset(centerX, centerY + hexHeight / 2f),
            
            // Vertex 4: Bottom-left
            Offset(centerX - halfWidth, centerY + quarterHeight),
            
            // Vertex 5: Top-left
            Offset(centerX - halfWidth, centerY - quarterHeight)
        )
        
        val numVertices = vertices.size
        
        return Path().apply {
            // Build path with quadratic Bézier curves at corners
            // For each vertex, we:
            // 1. Draw a line to a point before the vertex (offset by corner radius)
            // 2. Draw a quadratic curve through the vertex to a point after it
            
            for (i in 0 until numVertices) {
                val curr = vertices[i]
                val next = vertices[(i + 1) % numVertices]
                val prev = vertices[(i - 1 + numVertices) % numVertices]
                
                // Calculate direction vectors
                val toPrev = Offset(prev.x - curr.x, prev.y - curr.y)
                val toNext = Offset(next.x - curr.x, next.y - curr.y)
                
                // Normalize direction vectors
                val lenToPrev = sqrt(toPrev.x * toPrev.x + toPrev.y * toPrev.y)
                val lenToNext = sqrt(toNext.x * toNext.x + toNext.y * toNext.y)
                
                val normToPrev = Offset(toPrev.x / lenToPrev, toPrev.y / lenToPrev)
                val normToNext = Offset(toNext.x / lenToNext, toNext.y / lenToNext)
                
                // Calculate points before and after the vertex (offset by corner radius)
                val beforeVertex = Offset(
                    curr.x + normToPrev.x * cornerRadius,
                    curr.y + normToPrev.y * cornerRadius
                )
                val afterVertex = Offset(
                    curr.x + normToNext.x * cornerRadius,
                    curr.y + normToNext.y * cornerRadius
                )
                
                if (i == 0) {
                    // Start path at the point after the first vertex
                    moveTo(afterVertex.x, afterVertex.y)
                } else {
                    // Line to point before current vertex
                    lineTo(beforeVertex.x, beforeVertex.y)
                    // Quadratic curve through vertex to point after vertex
                    quadraticBezierTo(curr.x, curr.y, afterVertex.x, afterVertex.y)
                }
            }
            
            // Close the path: line to before first vertex, then curve through it
            val firstVertex = vertices[0]
            val secondVertex = vertices[1]
            val lastVertex = vertices[numVertices - 1]
            
            // Direction from first vertex to last and to second
            val toLastFromFirst = Offset(lastVertex.x - firstVertex.x, lastVertex.y - firstVertex.y)
            val toSecondFromFirst = Offset(secondVertex.x - firstVertex.x, secondVertex.y - firstVertex.y)
            
            val lenToLast = sqrt(toLastFromFirst.x * toLastFromFirst.x + toLastFromFirst.y * toLastFromFirst.y)
            val lenToSecond = sqrt(toSecondFromFirst.x * toSecondFromFirst.x + toSecondFromFirst.y * toSecondFromFirst.y)
            
            val normToLast = Offset(toLastFromFirst.x / lenToLast, toLastFromFirst.y / lenToLast)
            val normToSecond = Offset(toSecondFromFirst.x / lenToSecond, toSecondFromFirst.y / lenToSecond)
            
            val beforeFirst = Offset(
                firstVertex.x + normToLast.x * cornerRadius,
                firstVertex.y + normToLast.y * cornerRadius
            )
            val afterFirst = Offset(
                firstVertex.x + normToSecond.x * cornerRadius,
                firstVertex.y + normToSecond.y * cornerRadius
            )
            
            // Line to before first vertex
            lineTo(beforeFirst.x, beforeFirst.y)
            // Curve through first vertex back to start point
            quadraticBezierTo(firstVertex.x, firstVertex.y, afterFirst.x, afterFirst.y)
            
            // Close path
            close()
        }
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
