package toy.project.apiserver.com.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import toy.project.apiserver.domain.common.user.dto.UserDto;
import toy.project.apiserver.domain.common.user.entity.UserEntity;

import java.util.ArrayList;
import java.util.List;

/**
 * 사용자 인증 관련 공통 서비스
 * - UserEntity -> UserDto 변환
 * - 권한 생성 로직
 */
@Service
@RequiredArgsConstructor
public class UserAuthenticationService {
    
    /**
     * UserEntity를 UserDto로 변환 + 권한 설정
     * @param userEntity 사용자 엔티티
     * @return 권한이 설정된 UserDto
     */
    public UserDto convertToUserDtoWithAuthorities(UserEntity userEntity) {
        List<GrantedAuthority> authorities = createAuthorities(userEntity);
        
        return UserDto.builder()
            .id(userEntity.getId())
            .name(userEntity.getName())
            .passwd(userEntity.getPasswd())
            .salt(userEntity.getSalt())
            .roleId(userEntity.getRoleId())
            .centerId(userEntity.getCenterId() != null ? userEntity.getCenterId() : 1)
            .tenantId(userEntity.getTenantId())
            .groupId(userEntity.getGroupId())
            .partId(userEntity.getPartId())
            .email(userEntity.getEmail())
            .authorities(authorities)
            .accountNonExpired(true)
            .accountNonLocked(true)
            .credentialsNonExpired(true)
            .enabled(true)
            .build();
    }
    
    /**
     * 권한 생성 (공통 로직)
     * @param userEntity 사용자 엔티티
     * @return 권한 리스트
     */
    public List<GrantedAuthority> createAuthorities(UserEntity userEntity) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER")); // 기본 권한
        
        if (userEntity.getRoleId() != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + userEntity.getRoleId()));
        }
        
        return authorities;
    }
    
    /**
     * JWT 토큰용 권한 문자열 리스트 생성
     * @param userEntity 사용자 엔티티
     * @return 권한 문자열 리스트
     */
    public List<String> createRoleStrings(UserEntity userEntity) {
        List<String> roles = new ArrayList<>();
        roles.add("ROLE_USER");
        
        if (userEntity.getRoleId() != null) {
            roles.add("ROLE_" + userEntity.getRoleId());
        }
        
        return roles;
    }
}

