#include ../includes/simplexNoise4d.glsl

uniform float time;
uniform float positionFrequency;
uniform float timeFrequency;
uniform float noiseStrength;
attribute vec4 tangent;


float getDistortion(vec3 position)
{
    return simplexNoise4d(vec4(
        position * positionFrequency, 
        time * timeFrequency
    )) * noiseStrength;
}

void main()
{
    vec3 biTangent = cross(normal, tangent.xyz);

    // Neighbours positions
    float shift = 0.01;
    vec3 positionA = csm_Position + tangent.xyz * shift;
    vec3 positionB = csm_Position + biTangent * shift;

    float distortion = getDistortion(csm_Position);
    csm_Position += distortion * normal;

    positionA += getDistortion(positionA) * normal;
    positionB += getDistortion(positionB) * normal;

    // compute normal
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB);
}