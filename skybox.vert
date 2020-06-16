precision mediump float;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aPosition;

varying vec3 vTexCoords;

void main() {
 vTexCoords = aPosition;
 
 vec4 pos = uProjectionMatrix * mat4(mat3(uModelViewMatrix)) * vec4(aPosition, 1.0);
 gl_Position = pos.xyww;
}